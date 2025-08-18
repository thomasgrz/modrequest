import { getRulesFromStorage } from "../getRulesFromStorage/getRulesFromStorage";

export const resumeRules = async (ruleIds: number[]) => {
  const rulesInStorage = await getRulesFromStorage();
  const rulesAfterResuming = rulesInStorage.map((fromStorage) => {
    const shouldRuleBeEnabled = ruleIds.includes(fromStorage.details.id);
    if (!shouldRuleBeEnabled) return fromStorage;

    return {
      ...fromStorage,
      meta: {
        ...fromStorage.meta,
        enabledByUser: true,
      },
    };
  });

  await chrome.storage.local.set({
    rules: rulesAfterResuming,
  });
};
