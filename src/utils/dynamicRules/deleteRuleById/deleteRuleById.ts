import { getRulesFromStorage } from "../getRulesFromStorage/getRulesFromStorage";

export const deleteRuleById = async (id: number) => {
  const currentRulesInStorage = await getRulesFromStorage();
  const filteredRulesInStorage = currentRulesInStorage.filter(
    (rule) => rule.details.id !== id,
  );
  await chrome.storage.local.set({ rules: filteredRulesInStorage });
};
