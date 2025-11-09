import { RedirectRule } from "@/components/RuleCard/RuleCard";
import { generateRuleId } from "../generateRedirectRuleId";

export const createRedirectRule = (rule: {
  source: string;
  destination: string;
}): RedirectRule => {
  return {
    type: "redirect",
    meta: {
      enabledByUser: true,
      createdAt: new Date().getTime(),
    },
    details: {
      action: {
        type: "redirect",
        redirect: {
          url: rule.destination,
        },
      },
      condition: {
        resourceTypes: ["main_frame"],
        regexFilter: rule.source,
      },
      id: generateRuleId(),
    },
  };
};
