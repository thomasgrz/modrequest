export const detelateAllInterpolations = async () => {
  const allRules = await chrome.declarativeNetRequest.getDynamicRules();
  const ruleIds = allRules.map((rule) => rule.id);
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: ruleIds,
  });
  return chrome.storage.local.set({ rules: [] });
};
