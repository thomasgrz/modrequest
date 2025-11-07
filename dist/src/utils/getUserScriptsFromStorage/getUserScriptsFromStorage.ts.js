export const getUserScriptsFromStorage = async () => {
  const localExtensionStorage = await chrome.storage.local.get("scripts");
  return localExtensionStorage.scripts ?? [];
};
