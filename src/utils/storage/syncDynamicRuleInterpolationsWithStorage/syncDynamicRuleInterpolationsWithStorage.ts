import { getInterpolationsFromStorage } from "../getInterpolationsFromStorage/getInterpolationsFromStorage";
import { saveNewDynamicRuleInterpolation } from "../saveNewDynamicRuleInterpolation/saveNewDynamicRuleInterpolation";

/**
 * Retrieves all Interpolation objects from storage
 * and then filters out those that aren't related to
 * declarative network requests dynamic rules.
 */
export const getAllDynamicRuleInterpolationsFromStorage = async () => {
  /**
   * The interpolations defined within Interpolate web extension storage.
   */
  const interpolationsFromStorage = await getInterpolationsFromStorage();

  /**
   * The Declarative Net Request redirect rules defined within Interpolate web extension storage.
   */
  const redirectInterpolationsFromStorage = interpolationsFromStorage.filter(
    (interp) => interp?.type === "redirect",
  );
  /**
   * The Declarative Net Request dynamic header rules defined within Interpolate web extension storage.
   */
  const headerInterpolationsFromStorage = interpolationsFromStorage.filter(
    (interp) => interp?.type === "headers",
  );
  /**
   * Find all the rules defined within Interpolate web extension storage
   * that the browser doesn't know about yet.
   */
  const allDynamicRulesInStorage = [
    ...headerInterpolationsFromStorage,
    ...redirectInterpolationsFromStorage,
  ];

  return allDynamicRulesInStorage;
};

export const syncDynamicRuleInterpolationsWithStorage = async () => {
  const allDynamicRulesInStorage =
    await getAllDynamicRuleInterpolationsFromStorage();
  /**
   * All Declarative Net Request rules from the browser.
   */
  const dynamicRulesFromBrowser =
    await chrome.declarativeNetRequest.getDynamicRules();

  const dynamicRulesMissingFromBrowser = allDynamicRulesInStorage.filter(
    (ruleFromStorage) => {
      // Return true if rule is missing from browser
      const isRuleMissingFromBrowser = !dynamicRulesFromBrowser.some(
        // If some rule in the browser has the same id as the rule from storage,
        // then it is known about & not missing from browser.
        (fromBrowser) => fromBrowser.id === ruleFromStorage.details.id,
      );
      return isRuleMissingFromBrowser;
    },
  );

  await Promise.allSettled(
    dynamicRulesMissingFromBrowser.map((missingRule) =>
      saveNewDynamicRuleInterpolation(missingRule),
    ),
  );

  /**
   * Find all the rules defined within the browser associated
   * with the extension that are no longer in Interpolate web extension storage.
   */
  const orphanedRulesInBrowser = dynamicRulesFromBrowser.filter(
    (ruleFromBrowser) => {
      const isRuleMissingFromStorage = !allDynamicRulesInStorage.some(
        (ruleInStorage) => ruleInStorage.details.id === ruleFromBrowser.id,
      );

      return isRuleMissingFromStorage;
    },
  );

  // Find all the rules that the user has "paused"
  const pausedDynamicRulesInStorage = allDynamicRulesInStorage.filter(
    (rule) => {
      const isPaused = rule.enabledByUser === false;
      return isPaused;
    },
  );

  /**
   * Browser doesn't have a concept of "paused" dynamic rules WRT declarative
   * network requests, so we need to remove
   * them from the browser entirely (unlike static rulesets).
   */
  const removeRuleIds = [
    ...orphanedRulesInBrowser.map((rule) => rule.id),
    ...pausedDynamicRulesInStorage.map((rule) => Number(rule.details.id)),
  ];

  /**
   * Finally update rules in browser.
   */
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds,
  });
};
