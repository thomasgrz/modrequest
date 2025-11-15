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

import { createHeaderInterpolation } from "@/utils/factories/createHeaderInterpolation/createHeaderInterpolation";
import { createRedirectInterpolation } from "@/utils/factories/createRedirectInterpolation/createRedirectInterpolation";
import { createScriptInterpolation } from "@/utils/factories/createScriptInterpolation/createScriptInterpolation";
import { AnyInterpolation } from "@/utils/factories/Interpolation";
import { logger } from "@/utils/logger";
import { InterpolateStorage } from "@/utils/storage/InterpolateStorage/InterpolateStorage";
import { INTERPOLATE_SELECTED_FORM_KEY } from "@/utils/storage/storage.constants";
import { DashboardControls } from "../DashboardControls/DashboardControls";
import { HeaderForm } from "../HeaderForm/HeaderForm";
import { RedirectForm } from "../RedirecForm/RedirectForm";
import { InterpolationCard } from "../RuleCard/InterpolationCard";
import { ScriptForm } from "../ScriptForm/ScriptForm";
import styles from "./Dashboard.module.scss";

export const Dashboard = ({ showRules = true }: { showRules?: boolean }) => {
  const [displayedRules, setDisplayedRules] = useState<AnyInterpolation[]>([]);
  const [allPaused, setAllPaused] = useState<boolean | null>(null);
  const [defaultForm, setDefaultForm] = useState<string | null>(null);
  const [selectedConfigForm, setSelectedConfigForm] = useState<string | null>(
    null,
  );

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
        await InterpolateStorage.create([
          createRedirectInterpolation({
            source: value.redirectRuleForm.source,
            destination: value.redirectRuleForm.destination,
            name: value.redirectRuleForm.name || "Redirect Rule",
          }),
        ]);
        return;
      }
      if (meta.submitAction === "add-header") {
        await InterpolateStorage.create([
          createHeaderInterpolation({
            headerKey: value.headerRuleForm.key,
            headerValue: value.headerRuleForm.value,
            name: value.headerRuleForm.name,
          }),
        ]);
        return;
      }
      if (meta.submitAction === "create-script") {
        await InterpolateStorage.create([
          createScriptInterpolation({
            name: value.scriptForm.name,
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
    const rulesInStorage = await InterpolateStorage.getAll();
    const isEveryRulePaused = rulesInStorage?.every(
      (rule) => rule?.enabledByUser === false,
    );

    return !!isEveryRulePaused;
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
      const allRules = (await InterpolateStorage.getAll()) ?? [];
      setDisplayedRules(allRules);
    };

    getInitialRulesFromStorage();
  }, []);

  useEffect(() => {
    InterpolateStorage.subscribeToChanges(async (changes) => {
      setDisplayedRules(changes);
      const isEveryRulePaused = await getIsEveryRulePaused();
      setAllPaused(isEveryRulePaused);
    });
  }, []);

  const handleAllPaused = async () => {
    try {
      setAllPaused(true);
      await InterpolateStorage.disableAll();
      logger("handleAllPaused: all rules paused successfully.");
    } catch (e) {
      logger("handleAllPaused: failed with error: ", e);
    }
  };

  const handleAllResumed = async () => {
    try {
      setAllPaused(false);
      await InterpolateStorage.enableAll();
      logger("handleAllResumed: all rules resumed successfully");
    } catch (e) {
      logger("handleAllResumed: failed with error: ", e);
    }
  };

  const rulesSortedByCreationTime = () =>
    displayedRules.sort((item1, item2) => {
      return item2.createdAt - item1.createdAt;
    });

  const handleControlChange = (selectedForm: string) => {
    setSelectedConfigForm(selectedForm);
  };

  const handleDeleteAll = async () => {
    await InterpolateStorage.deleteAll();
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
          {displayedForm === "redirect-rules" && <RedirectForm form={form} />}
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
        onDeleteAllRules={handleDeleteAll}
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
                <InterpolationCard info={rule} />{" "}
              </Box>
            );
          })}
      </Flex>
    </ErrorBoundary>
  );
};
