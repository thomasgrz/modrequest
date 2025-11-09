import { getRulesFromStorage } from "./utils/dynamicRules/getRulesFromStorage/getRulesFromStorage";
import { subscribeToRuleChanges } from "./utils/dynamicRules/subscribeToRuleChanges/subscribeToRuleChanges";
import { syncDynamicRulesInStorage } from "./utils/dynamicRules/syncDynamicRulesInStorage/syncDynamicRulesInStorage";
import { logger } from "./utils/logger";
import { subscribeToUserScriptChanges } from "./utils/userScripts/subscribeToUserScriptChanges/subscribeToUserScriptChanges";
import { syncUserScriptsInStorage } from "./utils/userScripts/syncUserScriptsInStorage/syncUserScriptsInStorage";

logger("service worker installed", {});

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openSidePanel",
    title: "Open Interpolate panel",
    contexts: ["all"],
  });

  logger("installed", null);
  subscribeToRuleChanges(() => {
    logger("updated from background.ts", {});
    syncDynamicRulesInStorage();
  });
  subscribeToUserScriptChanges(() => {
    logger("updated from background.ts - user scripts", {});
    syncUserScriptsInStorage();
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openSidePanel" && tab?.windowId) {
    // This will open the panel in all the pages on the current window.
    chrome.sidePanel.open({ windowId: tab?.windowId });
  }
});

chrome.webRequest.onBeforeRedirect.addListener(
  async (details) => {
    const redirectUriIfExists = details?.redirectUrl;
    const rulesFromStorage = await getRulesFromStorage();
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
