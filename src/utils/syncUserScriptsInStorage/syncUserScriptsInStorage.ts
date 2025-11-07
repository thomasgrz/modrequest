import { getRulesFromStorage } from "../getRulesFromStorage/getRulesFromStorage";
import { getUserScriptsFromStorage } from "../getUserScriptsFromStorage/getUserScriptsFromStorage";
import { logger } from "../logger";

export const syncUserScriptsInStorage = async () => {
  // Get the rules explicitly create/managed by the extension in storage
  const userScriptsInStorage = await getUserScriptsFromStorage();
  // Get all the rules _associated_ with the extension from the browser
  const userScriptsFromBrowser = await chrome.userScripts.getScripts();

  const userScriptIdsFromBrowser = userScriptsFromBrowser.map(
    (rule) => rule.id,
  );

  // Find all the rules we _should_ enable in the browser
  const userScriptsMissingFromBrowser = userScriptsInStorage.filter(
    (fromUser) => {
      const isRuleMissingFromBrowser = !userScriptIdsFromBrowser.includes(
        fromUser.details.id,
      );
      return isRuleMissingFromBrowser;
    },
  );

  // Try to add new dynamic rule to both browser + storage
  const registerScript = async (
    rule: chrome.userScripts.RegisteredUserScript,
  ) => {
    try {
      await chrome.userScripts.register([rule]);
    } catch (e) {
      logger("Failed to sync user script", e);
      const errorMessage = (e as Error).message;
      // Grab the rule id being referenced in the error
      const errorRuleId = Number(errorMessage?.[1]);
      if (!errorRuleId) return;
      const _currentScripts = await getRulesFromStorage();
      const _scriptsWithError = _currentScripts.map((rule) => {
        if (rule.details.id === errorRuleId) {
          return {
            ...rule,
            type: "script",
            meta: {
              ...rule.meta,
              error: (e as Error).message,
            },
          };
        }

        return rule;
      });

      await chrome.storage.local.set({
        rules: _scriptsWithError,
      });
    }
  };

  await Promise.allSettled(
    userScriptsMissingFromBrowser
      .map((rule) => rule.details)
      .map(async (ruleDetails) => registerScript(ruleDetails)),
  );

  const ruleIdsFromStorage = userScriptsInStorage.map(
    (rule) => rule.details.id,
  );

  // Find any associated rules in browser that arent mentioned
  // the extensinon isnt explicitly managing
  const orphanedUserScriptsInBrowser = userScriptIdsFromBrowser.filter((id) => {
    const isOrphanedRule = !ruleIdsFromStorage.includes(id);
    return isOrphanedRule;
  });

  // Find all the rules that the user has "paused"
  const rulesDisabledByUser = userScriptsMissingFromBrowser.filter((rule) => {
    const isDisabled = !rule.meta.enabledByUser;
    return isDisabled;
  });

  // Find all the rules we _should_ disable in the browser
  const removeUserScriptIds = [
    ...orphanedUserScriptsInBrowser.map((id) => id),
    ...rulesDisabledByUser.map((rule) => rule.details.id),
  ];

  await chrome.userScripts.unregister({ ids: removeUserScriptIds });

  return;
};
