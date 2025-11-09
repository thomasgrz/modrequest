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

import { addRulesInStorage } from "@/utils/dynamicRules/addRulesInStorage/addRulesInStorage";
import { createHeaderRule } from "@/utils/dynamicRules/createHeaderRule/createHeaderRule";
import { createRedirectRule } from "@/utils/dynamicRules/createRedirectRule/createRedirectRule";
import { deleteAllRulesInStorage } from "@/utils/dynamicRules/deleteAllRulesInStorage/deleteAllRulesInStorage";
import { getRulesFromStorage } from "@/utils/dynamicRules/getRulesFromStorage/getRulesFromStorage";
import { subscribeToRuleChanges } from "@/utils/dynamicRules/subscribeToRuleChanges/subscribeToRuleChanges";
import { logger } from "@/utils/logger";
import { addScriptsInStorage } from "@/utils/userScripts/addScriptsInStorage/addScriptsInStorage";
import { createScript } from "@/utils/userScripts/createScript/createScript";
import { DashboardControls } from "../DashboardControls/DashboardControls";
import { HeaderForm } from "../HeaderForm/HeaderForm";
import { RedirectRuleForm } from "../RedirectRuleForm/RedirectRuleForm";
import {
  RedirectRule,
  RequestHeaderRule,
  RuleCard,
} from "../RuleCard/RuleCard";
import { ScriptForm } from "../ScriptForm/ScriptForm";
import styles from "./Dashboard.module.scss";

export const Dashboard = ({ showRules = true }: { showRules?: boolean }) => {
  const [displayedRules, setDisplayedRules] = useState<
    (RedirectRule | RequestHeaderRule)[]
  >([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const [allPaused, setAllPaused] = useState<boolean | null>(null);
  const [defaultForm, setDefaultForm] = useState<string | null>(null);
  const [selectedConfigForm, setSelectedConfigForm] = useState<string | null>(
    null,
  );

  const INTERPOLATE_SELECTED_FORM_KEY = "interpolate-selected-form";
  useEffect(() => {
    logger("Dashboard mounted", {});
    const handleDefaultSelection = async () => {
      const initialSelectedForm = await chrome.storage.local.get(
        INTERPOLATE_SELECTED_FORM_KEY,
      );
      if (initialSelectedForm[INTERPOLATE_SELECTED_FORM_KEY]) {
        logger(
          "Initial selected form:",
          initialSelectedForm[INTERPOLATE_SELECTED_FORM_KEY],
        );
        setDefaultForm(initialSelectedForm[INTERPOLATE_SELECTED_FORM_KEY]);
      }
    };
    handleDefaultSelection();
  }, []);

  useEffect(() => {
    chrome.storage.local.set({
      [INTERPOLATE_SELECTED_FORM_KEY]: selectedConfigForm,
    });
  }, [selectedConfigForm]);

  const form = useAppForm({
    ...dashboardFormOptions,
    validators: {},
    onSubmitMeta: {
      submitAction: null,
    },
    onSubmit: async ({ value, meta }) => {
      logger(`Selected action - ${meta?.submitAction}`, value);
      if (meta.submitAction === "add-redirect") {
        addRulesInStorage([
          createRedirectRule({
            source: value.redirectRuleForm.source,
            destination: value.redirectRuleForm.destination,
          }),
        ]);
        return;
      }
      if (meta.submitAction === "add-header") {
        addRulesInStorage([
          createHeaderRule({
            headerKey: value.headerRuleForm.key,
            headerValue: value.headerRuleForm.value,
          }),
        ]);
        return;
      }
      if (meta.submitAction === "create-script") {
        addScriptsInStorage([
          createScript({
            id: value.scriptForm.id,
            body: value.scriptForm.body,
            include: value.scriptForm.include,
          }),
        ]);
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
    const pausedRules = rulesInStorage.map(
      (rule: RedirectRule | RequestHeaderRule) => {
        return {
          ...rule,
          meta: {
            ...rule.meta,
            enabledByUser: false,
          },
        };
      },
    );

    chrome.storage.local.set({
      rules: pausedRules,
    });

    setAllPaused(true);
  };

  const handleAllResumed = async () => {
    const rulesInStorage = await getRulesFromStorage();
    const pausedRules = rulesInStorage.map(
      (rule: RedirectRule | RequestHeaderRule) => {
        return {
          ...rule,
          meta: {
            ...rule.meta,
            enabledByUser: true,
          },
        };
      },
    );

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

  const displayedForm = selectedConfigForm ?? defaultForm ?? "redirect-rules";

  return (
    <ErrorBoundary
      onError={console.error}
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
          value={selectedConfigForm ?? defaultForm ?? "redirect-rules"}
        >
          <SegmentedControl.Item value="redirect-rules">
            Redirects
          </SegmentedControl.Item>
          <SegmentedControl.Item value="headers">Headers</SegmentedControl.Item>
          <SegmentedControl.Item value="scripts">Scripts</SegmentedControl.Item>
        </SegmentedControl.Root>
      </Box>
      <Flex height={"100%"} direction="column" flexGrow={"1"}>
        <form>
          {displayedForm === "redirect-rules" && (
            <RedirectRuleForm form={form} />
          )}
          {displayedForm === "headers" && <HeaderForm form={form} />}
          {displayedForm === "scripts" && <ScriptForm form={form} />}
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
