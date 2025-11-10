import { syncDynamicRuleInterpolationsWithStorage } from "../syncDynamicRuleInterpolationsWithStorage/syncDynamicRuleInterpolationsWithStorage";
import { syncUserScriptsWithStorage } from "../syncUserScriptsWithStorage/syncUserScriptsWithStorage";

export const syncAllInterpolationsWithStorage = async () => {
  return Promise.allSettled([
    syncDynamicRuleInterpolationsWithStorage(),
    syncUserScriptsWithStorage(),
  ]);
};
