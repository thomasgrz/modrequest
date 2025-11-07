import { ScriptInterpolation } from "@/components/ScriptConfig/ScriptConfig";

export const subscribeToUserScriptChanges = (
  callback:
    | ((changes: {
        oldValue: ScriptInterpolation[];
        newValue: ScriptInterpolation[];
      }) => void)
    | (() => Promise<{}>),
) => {
  return chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.scripts) {
      const relevantChanges = changes.scripts as {
        oldValue: ScriptInterpolation[];
        newValue: ScriptInterpolation[];
      };
      callback(relevantChanges);
    }
  });
};
