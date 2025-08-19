import { getRulesFromStorage } from "../getRulesFromStorage/getRulesFromStorage";
import { logger } from "../logger";

export const syncDynamicRulesInStorage = async () => {
  // Get the rules explicitly create/managed by the extension in storage
  const rulesFromUser = await getRulesFromStorage();
  // Get all the rules _associated_ with the extension from the browser
  const rulesFromBrowser = await chrome.declarativeNetRequest.getDynamicRules();

  const ruleIdsFromBrowser = rulesFromBrowser.map((rule) => rule.id);

  // Find all the rules we _should_ enable in the browser
  const rulesMissingFromBrowser = rulesFromUser.filter((fromUser) => {
    const isRuleMissingFromBrowser = !ruleIdsFromBrowser.includes(
      fromUser.details.id,
    );
    return isRuleMissingFromBrowser;
  });

  // Try to add new dynamic rule to both browser + storage
  const safelyAddNewRule = async (rule: chrome.declarativeNetRequest.Rule) => {
    try {
      await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [rule],
      });
    } catch (e) {
      logger("Failed to sync dynamic rules", e);
      const errorMessage = new RegExp(/Rule\swith\sid\s(.\d+)/).exec(
        (e as Error).message,
      );
      // Grab the rule id being referenced in the error
      const errorRuleId = Number(errorMessage?.[1]);
      if (!errorRuleId) return;
      const currentRules = await getRulesFromStorage();
      const rulesWithError = currentRules.map((rule) => {
        if (rule.details.id === errorRuleId) {
          return {
            ...rule,
            meta: {
              ...rule.meta,
              error: (e as Error).message,
            },
          };
        }

        return rule;
      });

      await chrome.storage.local.set({
        rules: rulesWithError,
      });
    }
  };

  await Promise.allSettled(
    rulesMissingFromBrowser
      .map((rule) => rule.details)
      .map(async (rule) => safelyAddNewRule(rule)),
  );

  const ruleIdsFromStorage = rulesFromUser.map((rule) => rule.details.id);

  // Find any associated rules in browser that arent mentioned
  // the extensinon isnt explicitly managing
  const orphanedRulesInBrowser = rulesFromBrowser.filter((fromBrowser) => {
    const isOrphanedRule = !ruleIdsFromStorage.includes(fromBrowser.id);

    return isOrphanedRule;
  });

  // Find all the rules that the user has "paused"
  const rulesDisabledByUser = rulesFromUser.filter((rule) => {
    const isDisabled = !rule.meta.enabledByUser;
    return isDisabled;
  });

  // Find all the rules we _should_ disable in the browser
  const removeRuleIds = [
    ...orphanedRulesInBrowser.map((rule) => rule.id),
    ...rulesDisabledByUser.map((rule) => rule.details.id),
  ];

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds,
  });

  return;
};
