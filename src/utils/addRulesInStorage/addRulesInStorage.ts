import { RedirectRule } from "@/components/RuleCard/RuleCard";
import { getRulesFromStorage } from "../getRulesFromStorage/getRulesFromStorage";

export const addRulesInStorage = async (rules: RedirectRule[]) => {
  const extensionLocalStorage = await getRulesFromStorage();
  const rulesInStorage = extensionLocalStorage ?? [];
  return chrome.storage.local.set({
    rules: rulesInStorage.concat(rules),
  });
};
