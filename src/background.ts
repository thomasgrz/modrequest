import {
  HeaderInterpolation,
  RedirectInterpolation,
  ScriptInterpolation,
} from "./utils/factories/Interpolation";
import { logger } from "./utils/logger";
import { InterpolateStorage } from "./utils/storage/InterpolateStorage/InterpolateStorage";

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .then(() => logger("side panel behavior set (open on action click)"))
  .catch((error) => console.error(error));

chrome.runtime.onInstalled.addListener(() => {
  logger("service worker installed successfully");

  chrome.contextMenus.create({
    id: "openSidePanel",
    title: "Open Interpolate panel",
    contexts: ["all"],
  });

  const updateUserScripts = async (interpolations: ScriptInterpolation[]) => {
    // get all registered scripts
    const registeredScripts = await chrome.userScripts.getScripts();

    const scriptsByStatus = interpolations.reduce(
      (
        acc: {
          enabledScripts: ScriptInterpolation[];
          pausedScripts: ScriptInterpolation[];
        },
        curr,
      ) => {
        if (curr.enabledByUser) {
          return {
            ...acc,
            enabledScripts: [...acc.enabledScripts, curr],
          };
        }
        return {
          ...acc,
          pausedScripts: [...acc.pausedScripts, curr],
        };
      },
      {
        enabledScripts: [],
        pausedScripts: [],
      },
    );

    // unregister paused scripts
    const scriptsToUnRegister = registeredScripts.filter((script) => {
      return scriptsByStatus.pausedScripts.some(
        (paused) => paused.details.id === script.id,
      );
    });

    await chrome.userScripts.unregister({
      ids: [...scriptsToUnRegister.map((script) => script.id)],
    });

    // register any new enabled scripts
    const scriptsToRegister = interpolations.filter((interp) => {
      return registeredScripts.some(
        (script) => script.id === interp.details.id,
      );
    });

    if (scriptsToRegister.length) {
      await chrome.userScripts.register([
        ...scriptsToRegister.map((script) => script.details),
      ]);
    }
  };

  const updateDynamicRules = async (
    interpolations: (RedirectInterpolation | HeaderInterpolation)[],
  ) => {
    const registeredDynamicRules =
      await chrome.declarativeNetRequest.getDynamicRules();
    const rulesByStatus = interpolations.reduce(
      (
        acc: {
          enabledRules: (RedirectInterpolation | HeaderInterpolation)[];
          pausedRules: (RedirectInterpolation | HeaderInterpolation)[];
        },
        curr,
      ) => {
        if (curr.enabledByUser) {
          return {
            ...acc,
            enabledRules: [...acc.enabledRules, curr],
          };
        }
        return {
          ...acc,
          pausedRules: [...acc.pausedRules, curr],
        };
      },
      {
        enabledRules: [] as (RedirectInterpolation | HeaderInterpolation)[],
        pausedRules: [] as (RedirectInterpolation | HeaderInterpolation)[],
      },
    );
    // unregister any paused rules
    const rulesToPause = registeredDynamicRules.filter((rule) => {
      return rulesByStatus.pausedRules.some(
        (interp) => interp.details.id === rule.id,
      );
    });

    if (rulesToPause.length) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rulesToPause.map((rule) => rule.id),
      });
    }
    // register any enabled rules
    const rulesToEnable = rulesByStatus.enabledRules.filter((interp) => {
      return !registeredDynamicRules.some(
        (rule) => rule.id === interp.details.id,
      );
    });

    if (rulesToEnable.length) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rulesToEnable.map((rule) => rule.details),
      });
    }
  };

  InterpolateStorage.subscribeToChanges(async (newValues) => {
    logger("subscribeToInterpolations invoked from background.ts");
    try {
      try {
        const userScriptChanges = newValues?.filter((value) => {
          return value.type === "script";
        }) as ScriptInterpolation[];
        updateUserScripts(userScriptChanges);
      } catch (e) {
        logger("updateUserScripts error: ", e);
      }

      try {
        const dynamicRuleChanges = newValues?.filter((value) => {
          return ["redirect", "headers"].includes(value.type);
        }) as (RedirectInterpolation | HeaderInterpolation)[];
        updateDynamicRules(dynamicRuleChanges);
      } catch (e) {
        logger("updateDynamicRules error: ", e);
      }

      logger("syncAllInterpolationsWithStorage invoked successfully");
    } catch (e) {
      logger("syncAllInterpolationsWithStorage resulted with error: ", e);
    }
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openSidePanel" && tab?.windowId) {
    // This will open the panel in all the pages on the current window.
    chrome.sidePanel.open({ windowId: tab?.windowId });
  }
});

/**
 * Listen for redirects so that we can inform the user interface
 * to display some visual queue to the user that a redirect Interpolation
 * was enforced during navigation or fetching.
 */
chrome.webRequest.onBeforeRedirect.addListener(
  async (details) => {
    const redirectUriIfExists = details?.redirectUrl;
    const rulesFromStorage =
      ((await InterpolateStorage.getAllByTypes(["headers", "redirect"])) as (
        | RedirectInterpolation
        | HeaderInterpolation
      )[]) ?? [];

    const redirectUrls = rulesFromStorage.map((rule) => ({
      id: rule?.details?.id,
      redirectUrl: rule?.details?.action?.redirect?.url,
    }));

    const invokedRule = redirectUrls.find((redirect) => {
      return (
        redirect.redirectUrl &&
        redirectUriIfExists.startsWith(redirect.redirectUrl)
      );
    });

    if (invokedRule) {
      chrome.runtime.sendMessage(`redirect-${invokedRule.id}-hit`);
    }
  },
  { urls: ["<all_urls>"] },
);
