import { useEffect, useState } from "react";

import { deleteRuleById } from "@/utils/deleteRuleById/deleteRuleById";
import { pauseRules } from "@/utils/pauseRules/pauseRules";
import { resumeRules } from "@/utils/resumeRules/resumeRules";
import { subscribeToRuleChanges } from "@/utils/subscribeToRuleChanges/subscribeToRuleChanges";
import { Cross2Icon, RowSpacingIcon, TrashIcon } from "@radix-ui/react-icons";
import {
  AlertDialog,
  Badge,
  Box,
  Button,
  Callout,
  Card,
  Code,
  DataList,
  Flex,
  IconButton,
} from "@radix-ui/themes";
import { Collapsible } from "radix-ui";
import Pause from "../../assets/pause.svg";
import Play from "../../assets/play.svg";
import styles from "./RuleCard.module.scss";

export interface RedirectRule {
  meta: {
    enabledByUser?: boolean;
    createdAt: number;
    error?: string;
  };
  details: chrome.declarativeNetRequest.Rule;
}

export const RuleCard = ({
  onClick,
  rule,
}: {
  rule: RedirectRule;
  onClick: (data: unknown) => void;
}) => {
  const [isPaused, setIsPaused] = useState(!rule?.meta?.enabledByUser);
  const [isOpen, setIsOpen] = useState(false);
  const [hit, setHit] = useState(false);

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => {
      if (msg === `redirect-${rule.details.id}-hit`) {
        setHit(true);
        setTimeout(() => {
          setHit(false);
        }, 4000);
      }
    });
  }, []);

  useEffect(() => {
    subscribeToRuleChanges(
      ({
        newValue,
        oldValue,
      }: {
        newValue: RedirectRule[];
        oldValue: RedirectRule[];
      }) => {
        console.log("he");
        const parentConfig = newValue.find(
          (value) => value.details.id === rule.details.id,
        );
        const isParentConfigPaused = parentConfig?.meta.enabledByUser === false;
        console.log({
          isParentConfigPaused,
          parentConfig,
          rule: rule.details.id,
        });
        setIsPaused(isParentConfigPaused);
      },
    );
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

  return (
    <Card
      data-ui-active={hit}
      data-ui-error={!!rule.meta.error}
      className={styles.RuleCard}
    >
      {hit && <Badge color="green">Recently hit</Badge>}
      {rule.meta.error && (
        <Box p="1">
          <Callout.Root variant="surface" size="1" color="red">
            {rule.meta.error}
          </Callout.Root>
        </Box>
      )}
      <Collapsible.Root onOpenChange={setIsOpen} open={isOpen}>
        <Flex justify={"end"} flexGrow={"1"}>
          <Collapsible.Trigger asChild>
            <Button color="jade" size={"1"} radius="full">
              {isOpen ? <Cross2Icon /> : <RowSpacingIcon />}
            </Button>
          </Collapsible.Trigger>
        </Flex>
        <Flex direction={"column"} gap="1">
          <DataList.Root trim="end" size="1" m="1" onClick={onClick}>
            <DataList.Item>
              <DataList.Label>Redirect:</DataList.Label>
              <DataList.Value>
                {rule?.details?.action?.redirect?.url}
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>RegEx:</DataList.Label>
              <DataList.Value>
                <strong>{rule?.details?.condition?.regexFilter}</strong>
              </DataList.Value>
            </DataList.Item>
          </DataList.Root>
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
          <Box>
            <Flex gap="" flexGrow={"1"} direction={"row"} justify={"between"}>
              {isPaused ? (
                <IconButton
                  onClick={handleResumeClick}
                  color="green"
                  className={styles.PlayIcon}
                >
                  <Play />
                </IconButton>
              ) : (
                <IconButton
                  onClick={handlePauseClick}
                  color={"blue"}
                  className={styles.PauseIcon}
                >
                  <Pause />
                </IconButton>
              )}

              <AlertDialog.Root>
                <AlertDialog.Trigger>
                  <IconButton variant="soft" color="red">
                    <TrashIcon />
                  </IconButton>
                </AlertDialog.Trigger>
                <AlertDialog.Content>
                  <AlertDialog.Title>
                    Delete this rule forever?
                  </AlertDialog.Title>
                  <AlertDialog.Description>
                    You can also just pause this rule.
                  </AlertDialog.Description>
                  <Flex p="3" justify={"between"}>
                    <AlertDialog.Cancel>
                      <Button radius="small" variant="soft" color="gray">
                        Exit
                      </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                      <Button onClick={onDelete} radius="small" color="red">
                        Delete
                      </Button>
                    </AlertDialog.Action>
                  </Flex>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </Flex>
          </Box>
        </Flex>
      </Collapsible.Root>
    </Card>
  );
};
