import { useEffect, useState } from "react";

import Interpolation, {
  HeaderInterpolation,
  RedirectInterpolation,
  ScriptInterpolation,
} from "@/utils/factories/Interpolation";
import { pauseInterpolations } from "@/utils/ruleStatus/pauseInterpolations/pauseInterpolations";
import { resumeInterpolations } from "@/utils/ruleStatus/resumeInterpolations/resumeInterpolations";
import { deleteInterpolationById } from "@/utils/storage/deleteInterpolationInStorage/deleteInterpolationInStorage";
import { subscribeToInterpolations } from "@/utils/subscription/subscribeToInterpolations/subscribeToInterpolations";
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
import { RuleDeleteAction } from "../RuleDeleteAction/RuleDeleteAction";
import { RuleToggle } from "../RuleToggle/RuleToggle";
import styles from "./InterpolationCard.module.scss";

type InterpolationCardProps = {
  info: RedirectInterpolation | HeaderInterpolation | ScriptInterpolation;
};
export const InterpolationCard = ({ info }: InterpolationCardProps) => {
  const [isPaused, setIsPaused] = useState(!info.enabledByUser);
  const [isOpen, setIsOpen] = useState(false);
  const [hit, setHit] = useState(false);
  const [recentlyHitColor, setRecentlyHitColor] = useState<"green" | "gray">(
    "green",
  );

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg === `redirect-${info.details.id}-hit`) {
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
    subscribeToInterpolations(({ newValue }: { newValue: Interpolation[] }) => {
      const parentConfig = newValue.find(
        (value) => value.details.id === info.details.id,
      );
      const isParentConfigPaused = parentConfig?.enabledByUser === false;

      setIsPaused(isParentConfigPaused);
    });
  }, []);

  const onDelete = async () => {
    deleteInterpolationById(info.details.id);
  };

  const handleResumeClick = () => {
    resumeInterpolations([info.details.id]);
  };

  const handlePauseClick = () => {
    pauseInterpolations([info.details.id]);
  };

  const collapseTriggerContent = isOpen ? "collapse" : "expand";

  return (
    <Card
      data-ui-active={hit}
      data-ui-error={!!info.error}
      className={styles.InterpolationCard}
    >
      <Collapsible.Root onOpenChange={setIsOpen} open={isOpen}>
        <Flex justify={"between"} flexGrow="2">
          <Box>
            <Flex>
              {info.type === "redirect" && <RedirectPreview config={info} />}
              {info.type === "headers" && <HeaderPreview config={info} />}
            </Flex>
            <Flex py="1">
              {hit && !info.error && (
                <Badge color={recentlyHitColor}>Recently hit</Badge>
              )}
              {info.error && (
                <>
                  <Tooltip content={info.error}>
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
              disabled={!!info.error}
              onResumeClick={handleResumeClick}
              onPauseClick={handlePauseClick}
              isPaused={isPaused || !!info.error}
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
              <DataList.Value>{info.details.id}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Type:</DataList.Label>
              <DataList.Value>{info.details?.action?.type}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Enabled:</DataList.Label>
              <DataList.Value>{info.enabledByUser?.toString()}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Config:</DataList.Label>
              <DataList.Value>
                <Code>{JSON.stringify(info)}</Code>
              </DataList.Value>
            </DataList.Item>
          </DataList.Root>
        </Collapsible.Content>
      </Collapsible.Root>
    </Card>
  );
};
