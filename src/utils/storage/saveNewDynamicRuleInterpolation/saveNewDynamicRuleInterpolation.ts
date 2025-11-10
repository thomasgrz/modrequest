import Interpolation from "@/utils/factories/Interpolation";
import { logger } from "@/utils/logger";
import { getInterpolationsFromStorage } from "../getInterpolationsFromStorage/getInterpolationsFromStorage";
import { updateInterpolationsInStorage } from "../updateInterpolationsInStorage/updateInterpolationsInStorage";

/**
 * Save dynamic rule to Interpolate and, if possible, the browser.
 * Provide updated error messages in storage if syncing to browser fails.
 */
export const saveNewDynamicRuleInterpolation = async (
  newRuleInterpolation: Interpolation,
) => {
  const isRuleValidated = ["headers", "redirect"].includes(
    newRuleInterpolation.type,
  );

  if (!isRuleValidated) return;

  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: [
        // TODO: Fix types here
        newRuleInterpolation.details as chrome.declarativeNetRequest.Rule,
      ],
    });
  } catch (e) {
    logger("Failed to sync dynamic rule with browser", {
      rule: newRuleInterpolation,
      error: e,
    });
    const errorMessage = new RegExp(/Rule\swith\sid\s(.\d+)/).exec(
      (e as Error).message,
    );
    // Grab the rule id being referenced in the error
    const errorRuleId = Number(errorMessage?.[1]);
    const latestInterpolations = await getInterpolationsFromStorage();
    const interpolationsWithNewError = latestInterpolations.map(
      (_interpolation) => {
        if (_interpolation.details.id === errorRuleId) {
          return {
            ..._interpolation,
            error: (e as Error).message,
          };
        }

        return _interpolation;
      },
    );

    /**
     * Update interpolation web e
     */
    await updateInterpolationsInStorage(interpolationsWithNewError);
  }
};
