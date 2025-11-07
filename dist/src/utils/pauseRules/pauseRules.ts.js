import { getRulesFromStorage } from "/src/utils/getRulesFromStorage/getRulesFromStorage.ts.js";
import { getUserScriptsFromStorage } from "/src/utils/getUserScriptsFromStorage/getUserScriptsFromStorage.ts.js";
export const pauseRules = async (ruleIds) => {
  const dynamicRules = await getRulesFromStorage();
  const scripts = await getUserScriptsFromStorage();
  await chrome.storage.local.set({
    rules: dynamicRules.map((rule) => {
      const shouldRuleBePaused = ruleIds.includes(rule.details.id);
      if (!shouldRuleBePaused) return rule;
      return {
        ...rule,
        meta: {
          ...rule.meta,
          enabledByUser: false
        }
      };
    }),
    scripts: scripts.map((rule) => {
      const shouldRuleBePaused = ruleIds.includes(rule.details.id);
      if (!shouldRuleBePaused) return rule;
      return {
        ...rule,
        meta: {
          ...rule.meta,
          enabledByUser: false
        }
      };
    })
  });
};
