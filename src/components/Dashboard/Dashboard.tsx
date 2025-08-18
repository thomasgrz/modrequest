import { dashboardFormOptions } from "@/contexts/dashboard-context";
import { useAppForm } from "@/hooks/useForm/useForm";
import { Box, Callout, Flex, Separator, Tabs } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

import { addRulesInStorage } from "@/utils/addRulesInStorage/addRulesInStorage";
import { deleteAllRulesInStorage } from "@/utils/deleteAllRulesInStorage/deleteAllRulesInStorage";
import { generateRedirectRuleId } from "@/utils/generateRedirectRuleId";
import { getRulesFromStorage } from "@/utils/getRulesFromStorage/getRulesFromStorage";
import { logger } from "@/utils/logger";
import { subscribeToRuleChanges } from "@/utils/subscribeToRuleChanges/subscribeToRuleChanges";
import { DashboardControls } from "../DashboardControls/DashboardControls";
import { RedirectRuleForm } from "../RedirectRuleForm/RedirectRuleForm";
import { RedirectRule, RuleCard } from "../RuleCard/RuleCard";
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
      id: generateRedirectRuleId(),
    },
  };
};

export const Dashboard = ({ showRules = true }: { showRules: boolean }) => {
  const [displayedRules, setDisplayedRules] = useState<RedirectRule[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const [allPaused, setAllPaused] = useState<boolean | null>(null);
  const [debugValue, setDebugValue] = useState<RedirectRule[]>();

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

  const handleSyncAllRules = async () => {
    const enabledRules = await chrome.declarativeNetRequest.getDynamicRules();

    setDebugValue(
      enabledRules.map((rule) => ({
        meta: {
          enabledByUser: true,
          createdAt: 0,
        },
        details: rule,
      })),
    );
  };

  return (
    <ErrorBoundary
      onError={(e) => alert(e.stack)}
      fallback={<p>"Something went wrong"</p>}
    >
      <Tabs.Root className={styles.Dashboard} defaultValue="redirect-rules">
        {lastError && (
          <Flex p="1">
            <Callout.Root size={"1"} color="ruby">
              {lastError}
            </Callout.Root>
          </Flex>
        )}

        <Tabs.List size="1">
          <Tabs.Trigger value="redirect-rules">Redirects</Tabs.Trigger>
          <Tabs.Trigger value="debug">Debug</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="debug">
          {debugValue?.map?.((rule: RedirectRule) => {
            return <RuleCard rule={rule} onClick={() => {}} />;
          })}
        </Tabs.Content>
        <Tabs.Content value="redirect-rules">
          <Flex height={"100%"} direction="column" flexGrow={"1"}>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
              }}
            >
              <Box>
                <RedirectRuleForm form={form} />
              </Box>
            </form>
            <Separator size={"4"} my="3" />
            <Flex p="1" flexGrow={"1"} direction={"column"} justify={"between"}>
              <Box>
                <Flex gap="1" direction="column">
                  {showRules &&
                    displayedRules?.map((rule) => {
                      return <RuleCard rule={rule} onClick={() => {}} />;
                    })}
                </Flex>
              </Box>
              <Box width={"100%"} position={"fixed"} left="0" bottom="0">
                <Separator size={"4"} />
                <DashboardControls
                  allPaused={!!allPaused}
                  onSyncAllRules={handleSyncAllRules}
                  onResumeAllRules={handleAllResumed}
                  onPauseAllRules={handleAllPaused}
                  onDeleteAllRules={deleteAllRulesInStorage}
                />
              </Box>
            </Flex>
          </Flex>
        </Tabs.Content>
      </Tabs.Root>
    </ErrorBoundary>
  );
};
