export const subscribeToUserScriptChanges = (callback) => {
  return chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.scripts) {
      const relevantChanges = changes.scripts;
      callback(relevantChanges);
    }
  });
};
