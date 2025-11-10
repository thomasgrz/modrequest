import { AnyInterpolation } from "@/utils/factories/Interpolation";

export const subscribeToInterpolations = (
  callback:
    | ((changes: {
        oldValue: AnyInterpolation[];
        newValue: AnyInterpolation[];
      }) => void)
    | (() => Promise<{}>),
) => {
  return chrome.storage.sync.onChanged.addListener((changes) => {
    if (changes.rules) {
      const relevantChanges = changes.rules as {
        oldValue: AnyInterpolation[];
        newValue: AnyInterpolation[];
      };
      callback(relevantChanges);
    }
  });
};
