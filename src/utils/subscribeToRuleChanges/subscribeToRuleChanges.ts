import { RedirectRule } from "@/components/RuleCard/RuleCard";

export const subscribeToRuleChanges = (
  callback:
    | ((changes: {
        oldValue: RedirectRule[];
        newValue: RedirectRule[];
      }) => void)
    | (() => Promise<{}>),
) => {
  return chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.rules) {
      const relevantChanges = changes.rules as {
        oldValue: RedirectRule[];
        newValue: RedirectRule[];
      };
      callback(relevantChanges);
    }
  });
};
