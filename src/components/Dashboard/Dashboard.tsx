import { dashboardFormOptions } from "@/contexts/dashboard-context";
import { useAppForm } from "@/hooks/useForm/useForm";
import {
  Box,
  Callout,
  Flex,
  SegmentedControl,
  Separator,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { addRulesInStorage } from "@/utils/addRulesInStorage/addRulesInStorage";
import { deleteAllRulesInStorage } from "@/utils/deleteAllRulesInStorage/deleteAllRulesInStorage";
import { generateRuleId } from "@/utils/generateRedirectRuleId";
import { getRulesFromStorage } from "@/utils/getRulesFromStorage/getRulesFromStorage";
import { logger } from "@/utils/logger";
import { subscribeToRuleChanges } from "@/utils/subscribeToRuleChanges/subscribeToRuleChanges";
import { DashboardControls } from "../DashboardControls/DashboardControls";
import { HeaderForm } from "../HeaderForm/HeaderForm";
import { RedirectRuleForm } from "../RedirectRuleForm/RedirectRuleForm";
import {
  RedirectRule,
  RequestHeaderRule,
  RuleCard,
} from "../RuleCard/RuleCard";
import styles from "./Dashboard.module.scss";

const createRedirectRule = (rule: {
  source: string;
  destination: string;
}): RedirectRule => {
  return {
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

const createHeaderRule = (rule: {
  headerKey: string;
  headerValue: string;
}): RequestHeaderRule => {
  return {
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

export const Dashboard = ({ showRules = true }: { showRules?: boolean }) => {
  const [displayedRules, setDisplayedRules] = useState<RedirectRule[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const [allPaused, setAllPaused] = useState<boolean | null>(null);
  const [selectedConfigForm, setSelectedConfigForm] =
    useState("redirect-rules");

  const form = useAppForm({
    ...dashboardFormOptions,
    validators: {},
    onSubmitMeta: {
      submitAction: null,
    },
    onSubmit: async ({ value, meta }) => {
      logger(`Selected action - ${meta.submitAction}`, value);
      if (meta.submitAction === "redirect-rule") {
        addRulesInStorage([createRedirectRule(value)]);
        return;
      }
      debugger;
      if (meta.submitAction === "add-header") {
        addRulesInStorage([createHeaderRule(value)]);
        return;
      }
    },
  });

  const getIsEveryRulePaused = async () => {
    const rulesInStorage = await getRulesFromStorage();
    const isEveryRulePaused = rulesInStorage.every(
      (rule) => rule?.meta?.enabledByUser === false,
    );

    return isEveryRulePaused;
  };

  useEffect(() => {
    const getInitAllPaused = async () => {
      const isEveryRulePaused = await getIsEveryRulePaused();
      setAllPaused(isEveryRulePaused);
    };

    getInitAllPaused();
  }, []);

  useEffect(() => {
    const getInitialRulesFromStorage = async () => {
      const rulesFromStorage = await getRulesFromStorage();
      setDisplayedRules(rulesFromStorage);
    };

    getInitialRulesFromStorage();
  }, []);

  useEffect(() => {
    subscribeToRuleChanges(async (changes) => {
      setDisplayedRules(changes.newValue);
      const isEveryRulePaused = await getIsEveryRulePaused();
      setAllPaused(isEveryRulePaused);
      setLastError(chrome.runtime.lastError?.message ?? null);
    });
  }, []);

  const handleAllPaused = async () => {
    const rulesInStorage = await getRulesFromStorage();
    const pausedRules = rulesInStorage.map((rule: RedirectRule) => {
      return {
        ...rule,
        meta: {
          ...rule.meta,
          enabledByUser: false,
        },
      };
    });

    chrome.storage.local.set({
      rules: pausedRules,
    });

    setAllPaused(true);
  };

  const handleAllResumed = async () => {
    const rulesInStorage = await getRulesFromStorage();
    const pausedRules = rulesInStorage.map((rule: RedirectRule) => {
      return {
        ...rule,
        meta: {
          ...rule.meta,
          enabledByUser: true,
        },
      };
    });

    chrome.storage.local.set({
      rules: pausedRules,
    });

    setAllPaused(false);
  };

  const rulesSortedByCreationTime = () =>
    displayedRules.sort((item1, item2) => {
      return item2.meta.createdAt - item1.meta.createdAt;
    });

  const handleControlChange = (selectedForm: string) => {
    setSelectedConfigForm(selectedForm);
  };
  return (
    <ErrorBoundary
      onError={(e) => alert(e.stack)}
      fallback={
        <Callout.Root style={{ height: "100%" }} color="red">
          Something went wrong
        </Callout.Root>
      }
    >
      {lastError && (
        <Flex p="1">
          <Callout.Root size={"1"} color="ruby">
            {lastError}
          </Callout.Root>
        </Flex>
      )}
      <Box p="2">
        <SegmentedControl.Root
          onValueChange={handleControlChange}
          size="1"
          value={selectedConfigForm}
        >
          <SegmentedControl.Item value="redirect-rules">
            Redirects
          </SegmentedControl.Item>
          <SegmentedControl.Item value="headers">Headers</SegmentedControl.Item>
        </SegmentedControl.Root>
      </Box>
      <Flex height={"100%"} direction="column" flexGrow={"1"}>
        <form>
          {selectedConfigForm === "redirect-rules" ? (
            <RedirectRuleForm form={form} />
          ) : (
            <HeaderForm form={form} />
          )}
        </form>
      </Flex>
      <Separator size={"4"} my="1" />
      <DashboardControls
        ruleCount={displayedRules.length}
        allPaused={!!allPaused}
        onResumeAllRules={handleAllResumed}
        onPauseAllRules={handleAllPaused}
        onDeleteAllRules={deleteAllRulesInStorage}
      />
      <Separator size={"4"} my="1" />
      <Flex
        width="100%"
        p="1"
        flexGrow={"1"}
        direction={"column"}
        wrap="wrap"
        justify={"between"}
      >
        {showRules &&
          rulesSortedByCreationTime()?.map((rule) => {
            return (
              <Box width={"100%"} p="1" className={styles.RuleCardContainer}>
                <RuleCard rule={rule} />{" "}
              </Box>
            );
          })}
      </Flex>
    </ErrorBoundary>
  );
};
