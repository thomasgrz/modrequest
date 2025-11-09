import { useEffect, useState } from "react";

import { deleteRuleById } from "@/utils/dynamicRules/deleteRuleById/deleteRuleById";
import { pauseRules } from "@/utils/dynamicRules/pauseRules/pauseRules";
import { resumeRules } from "@/utils/dynamicRules/resumeRules/resumeRules";
import { subscribeToRuleChanges } from "@/utils/dynamicRules/subscribeToRuleChanges/subscribeToRuleChanges";
import {
  DoubleArrowDownIcon,
  DoubleArrowUpIcon,
  QuestionMarkCircledIcon,
} from "@radix-ui/react-icons";
import {
  Badge,
  Box,
  Button,
  Card,
  Code,
  DataList,
  Flex,
  Tooltip,
} from "@radix-ui/themes";
import { Collapsible } from "radix-ui";
import { HeaderRulePreview } from "../HeaderRulePreview/HeaderRulePreview";
import { RedirectRulePreview } from "../RedirectRulePreview/RedirectRulePreview";
import { RuleDeleteAction } from "../RuleDeleteAction/RuleDeleteAction";
import { RuleToggle } from "../RuleToggle/RuleToggle";
import styles from "./RuleCard.module.scss";

export interface RedirectRule {
  type: "redirect";
  meta: {
    enabledByUser?: boolean;
    createdAt: number;
    error?: string;
  };
  details: chrome.declarativeNetRequest.Rule;
}

export interface RequestHeaderRule {
  type: "headers";
  meta: {
    enabledByUser?: boolean;
    createdAt: number;
    error?: string;
  };
  details: chrome.declarativeNetRequest.Rule;
}

export const RuleCard = ({
  rule,
}: {
  rule: RedirectRule | RequestHeaderRule;
}) => {
  const [isPaused, setIsPaused] = useState(!rule?.meta?.enabledByUser);
  const [isOpen, setIsOpen] = useState(false);
  const [hit, setHit] = useState(false);
  const [recentlyHitColor, setRecentlyHitColor] = useState<"green" | "gray">(
    "green",
  );

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg === `redirect-${rule.details.id}-hit`) {
        setRecentlyHitColor("green");
        setHit(true);
        setTimeout(() => {
          setRecentlyHitColor("gray");
        }, 5000);
        setTimeout(() => {
          setHit(false);
        }, 30000);
      }
    });
  }, [isPaused]);

  useEffect(() => {
    subscribeToRuleChanges(({ newValue }: { newValue: RedirectRule[] }) => {
      const parentConfig = newValue.find(
        (value) => value.details.id === rule.details.id,
      );
      const isParentConfigPaused = parentConfig?.meta.enabledByUser === false;

      setIsPaused(isParentConfigPaused);
    });
  }, []);

  const onDelete = async () => {
    deleteRuleById(rule.details.id);
  };

  const handleResumeClick = () => {
    resumeRules([rule.details.id]);
  };

  const handlePauseClick = () => {
    pauseRules([rule.details.id]);
  };

  const collapseTriggerContent = isOpen ? "collapse" : "expand";

  return (
    <Card
      data-ui-active={hit}
      data-ui-error={!!rule.meta.error}
      className={styles.RuleCard}
    >
      <Collapsible.Root onOpenChange={setIsOpen} open={isOpen}>
        <Flex justify={"between"} flexGrow="2">
          <Box>
            <Flex>
              {rule.type === "redirect" && <RedirectRulePreview rule={rule} />}
              {rule.type === "headers" && <HeaderRulePreview rule={rule} />}
            </Flex>
            <Flex py="1">
              {hit && !rule.meta.error && (
                <Badge color={recentlyHitColor}>Recently hit</Badge>
              )}
              {rule.meta.error && (
                <>
                  <Tooltip content={rule.meta.error}>
                    <Badge color="ruby">
                      Error
                      <QuestionMarkCircledIcon />
                    </Badge>
                  </Tooltip>
                </>
              )}
            </Flex>
          </Box>
          <Flex direction={"column"} gap="3" className={styles.DeleteAction}>
            <RuleDeleteAction onDelete={onDelete} />
            <RuleToggle
              disabled={!!rule.meta.error}
              onResumeClick={handleResumeClick}
              onPauseClick={handlePauseClick}
              isPaused={isPaused || !!rule.meta.error}
            />
            <Tooltip content={collapseTriggerContent}>
              <Collapsible.Trigger asChild>
                <Button color="jade" size={"1"} radius="full">
                  {isOpen ? <DoubleArrowUpIcon /> : <DoubleArrowDownIcon />}
                </Button>
              </Collapsible.Trigger>
            </Tooltip>
          </Flex>
        </Flex>
        <Collapsible.Content asChild>
          <DataList.Root trim="end" size="1" m="1">
            <DataList.Item align={"end"}>
              <DataList.Label color="jade">Id:</DataList.Label>
              <DataList.Value>{rule.details.id}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Type:</DataList.Label>
              <DataList.Value>{rule?.details?.action?.type}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Enabled:</DataList.Label>
              <DataList.Value>
                {rule?.meta.enabledByUser?.toString()}
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Config:</DataList.Label>
              <DataList.Value>
                <Code>{JSON.stringify(rule)}</Code>
              </DataList.Value>
            </DataList.Item>
          </DataList.Root>
        </Collapsible.Content>
      </Collapsible.Root>
    </Card>
  );
};
