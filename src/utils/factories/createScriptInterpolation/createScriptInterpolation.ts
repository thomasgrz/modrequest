import { ScriptInterpolation } from "@/utils/factories/Interpolation";
import { generateRuleId } from "@/utils/id/generateRedirectRuleId";

export const createScriptInterpolation = (scriptForm: {
  allFrames?: boolean;
  body: string;
  exclude?: boolean;
  id: string;
  runAt?: string;
  include?: string;
  name: string;
}) => {
  return new ScriptInterpolation({
    name: scriptForm.name,
    details: {
      js: [{ code: scriptForm.body }],
      id: generateRuleId().toString(),
      matches: [scriptForm.include || "*://*/*"],
    },
  });
};
