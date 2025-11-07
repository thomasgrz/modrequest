export const subscribeToRuleChanges = (callback) => {
  return chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.rules) {
      const relevantChanges = changes.rules;
      callback(relevantChanges);
    }
  });
};
