import { RequestHeaderRule } from "@/components/RuleCard/RuleCard";
import { generateRuleId } from "../generateRedirectRuleId";

export const createHeaderRule = (rule: {
  headerKey: string;
  headerValue: string;
}): RequestHeaderRule => {
  return {
    type: "headers",
    meta: {
      enabledByUser: true,
      createdAt: new Date().getTime(),
    },
    details: {
      action: {
        type: "modifyHeaders",
        requestHeaders: [
          {
            header: rule.headerKey,
            operation: "set",
            value: rule.headerValue,
          },
        ],
      },
      condition: {
        resourceTypes: [
          "sub_frame",
          "font",
          "main_frame",
          "xmlhttprequest",
          "script",
          "image",
          "webbundle",
          "media",
          "other",
          "object",
        ],
        regexFilter: ".*",
      },
      id: generateRuleId(),
    },
  };
};
