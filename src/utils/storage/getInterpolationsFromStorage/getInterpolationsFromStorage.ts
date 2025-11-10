import {
  HeaderInterpolation,
  RedirectInterpolation,
  ScriptInterpolation,
} from "@/utils/factories/Interpolation";

export const getInterpolationsFromStorage = async () => {
  const localExtensionStorage = await chrome.storage.sync.get("interpolations");
  return (
    (localExtensionStorage.interpolations as (
      | ScriptInterpolation
      | RedirectInterpolation
      | HeaderInterpolation
    )[]) ?? []
  );
};
