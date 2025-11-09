import { UserScript } from "../createScript/createScript";

export const addScriptsInStorage = async (scripts: UserScript[]) => {
  const extensionLocalStorage =
    (await chrome.storage.local.get("scripts"))?.scripts ?? [];
  const scriptsInStorage = extensionLocalStorage ?? [];
  return chrome.storage.local.set({
    scripts: scriptsInStorage.concat(scripts),
  });
};
