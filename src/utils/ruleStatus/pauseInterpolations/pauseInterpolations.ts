import { AnyInterpolation } from "@/utils/factories/Interpolation";
import { INTERPOLATION_STORAGE_KEY } from "@/utils/storage/storage.constants";
import { getInterpolationsFromStorage } from "../../storage/getInterpolationsFromStorage/getInterpolationsFromStorage";

export const pauseInterpolations = async (interpolations: AnyInterpolation) => {
  const rulesInStorage = await getInterpolationsFromStorage();

  await chrome.storage.sync.set({
    [INTERPOLATION_STORAGE_KEY]: rulesInStorage.map(
      (interpolation: AnyInterpolation) => {
        const shouldRuleBePaused = ids.includes(interpolation.details.id);
        if (!shouldRuleBePaused) return interpolation;

        return {
          ...interpolation,
          enabledByUser: false,
        };
      },
    ),
  });
};
