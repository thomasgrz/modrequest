import { getRulesFromStorage } from "/src/utils/getRulesFromStorage/getRulesFromStorage.ts.js";
import { getUserScriptsFromStorage } from "/src/utils/getUserScriptsFromStorage/getUserScriptsFromStorage.ts.js";
export const toggleEnabledRules = async (rules, status) => {
  const isEnabled = status === "resume";
  const dynamicRules = await getRulesFromStorage();
  const scripts = await getUserScriptsFromStorage();
  const rulesAfterResuming = [...scripts, ...dynamicRules].map(
    (fromStorage) => {
      const shouldRuleBeEnabled = rules.some(
        (ruleToBeEnabled) => ruleToBeEnabled.details.id === fromStorage.details.id
      );
      if (!shouldRuleBeEnabled) return fromStorage;
      return {
        ...fromStorage,
        meta: {
          ...fromStorage.meta,
          enabledByUser: isEnabled
        }
      };
    }
  );
  const headerRules = rulesAfterResuming.filter(
    (rule) => rule.type === "header"
  );
  const redirectRules = rulesAfterResuming.filter(
    (rule) => rule.type === "redirect"
  );
  const updatedScripts = rulesAfterResuming.filter(
    (rule) => rule.type === "script"
  );
  await chrome.storage.local.set({
    rules: [...headerRules, redirectRules],
    scripts: updatedScripts
  });
};
