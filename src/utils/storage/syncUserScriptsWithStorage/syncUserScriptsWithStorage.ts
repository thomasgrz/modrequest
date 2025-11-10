import { createScriptInterpolation } from "@/utils/factories/createScriptInterpolation/createScriptInterpolation";
import { ScriptInterpolationConfig } from "@/utils/factories/Interpolation";
import { getInterpolationsFromStorage } from "../getInterpolationsFromStorage/getInterpolationsFromStorage";
import { updateInterpolationsInStorage } from "../updateInterpolationsInStorage/updateInterpolationsInStorage";

export const getUserScriptsFromStorage = async () => {
  const interpolationsInStorage = await getInterpolationsFromStorage();
  const userScriptsFromStorage = interpolationsInStorage.filter(
    (interpolation) => {
      interpolation.type === "script";
    },
  );
  return userScriptsFromStorage;
};

/**
 * Attemps to synchronize user scripts defined in Interpolate web extension storage
 * with those userScripts defined in the browser.
 *
 * User script Interpolations from web extension storage will be registered with
 * the browser if they're missing from the browser initially.
 *
 * If an "orphaned" user script is found in the browser it will be added to the
 * Interpolate web extension storage as an Interpolation object
 */
export const syncUserScriptsWithStorage = async () => {
  /**
   * The user scripts defined within Interpolate web extension storage.
   */
  const userScriptsInStorage = await getUserScriptsFromStorage();

  /**
   * The user scripts currently registered in the browser.
   */
  const registeredUserScripts = await chrome.userScripts.getScripts();

  const userScriptsMissingFromBrowser = userScriptsInStorage.filter(
    (scriptInterpolation) => {
      // If there is  user script in storage that has an ID that
      // the browser doesn't know about it is missing from browser.
      const isScriptMissingFromBrowser = !registeredUserScripts.some(
        (registeredScript) =>
          registeredScript.id === scriptInterpolation.details.id,
      );
      return isScriptMissingFromBrowser;
    },
  );

  const newUserScripts = userScriptsMissingFromBrowser.map((interpolation) => {
    return interpolation.details as ScriptInterpolationConfig["details"];
  });
  /**
   * Register new user scripts from Interpolate web extension with browser.
   */
  chrome.userScripts.register(newUserScripts);

  const orphanedUserScripts = registeredUserScripts.filter(
    (registeredScript) => {
      // If there is  user script in browser that has an ID that
      // the Interpolate doesn't know about it is missing from web extension storage.
      const isScriptMissingFromStorage = !userScriptsInStorage.some(
        (scriptInterpolation) =>
          scriptInterpolation.details.id === registeredScript.id,
      );

      return isScriptMissingFromStorage;
    },
  );

  const newInterpolations = orphanedUserScripts.map((scriptDetails) => {
    return createScriptInterpolation({
      ...scriptDetails,
      body: scriptDetails?.js?.[0]?.code ?? "UNKNOWN",
      name: "orphaned-script-id-" + scriptDetails?.id,
    });
  });

  await updateInterpolationsInStorage(newInterpolations);
};
