import { getUserScriptsFromStorage } from "../getUserScriptsFromStorage/getUserScriptsFromStorage";

export const deleteScriptFromStroage = async (ids: string[]) => {
  const currentScripts = await getUserScriptsFromStorage();
  const filteredScripts = currentScripts.filter((script) => {
    return ids.includes(script.details.id);
  });
  chrome.storage.local.set({ scripts: filteredScripts });
};
