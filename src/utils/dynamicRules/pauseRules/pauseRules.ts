import { RedirectRule } from "@/components/RuleCard/RuleCard";
import { getRulesFromStorage } from "../getRulesFromStorage/getRulesFromStorage";

export const pauseRules = async (ruleIds: number[]) => {
  const rulesInStorage = await getRulesFromStorage();

  await chrome.storage.local.set({
    rules: rulesInStorage.map((rule: RedirectRule) => {
      const shouldRuleBePaused = ruleIds.includes(rule.details.id);
      if (!shouldRuleBePaused) return rule;

      return {
        ...rule,
        meta: {
          ...rule.meta,
          enabledByUser: false,
        },
      };
    }),
  });
};
