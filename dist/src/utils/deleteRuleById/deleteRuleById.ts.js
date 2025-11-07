import { getRulesFromStorage } from "/src/utils/getRulesFromStorage/getRulesFromStorage.ts.js";
export const deleteRuleById = async (id) => {
  const currentRulesInStorage = await getRulesFromStorage();
  const filteredRulesInStorage = currentRulesInStorage.filter(
    (rule) => rule.details.id !== id
  );
  await chrome.storage.local.set({ rules: filteredRulesInStorage });
};
