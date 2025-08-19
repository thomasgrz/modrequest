import { PauseIcon, TrashIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex, IconButton } from "@radix-ui/themes";
import { AlertDialog } from "radix-ui";
import { RedirectRule } from "../RuleCard/RuleCard";

export const DebugRuleCard = ({ rule }: { rule: RedirectRule }) => {
  return (
    <Box>
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
                <PauseIcon />
              </IconButton>
            )}

            <AlertDialog.Root>
              <AlertDialog.Trigger>
                <IconButton variant="soft" color="red">
                  <TrashIcon />
                </IconButton>
              </AlertDialog.Trigger>
              <AlertDialog.Content>
                <AlertDialog.Title>Delete this rule forever?</AlertDialog.Title>
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
                    <Button onClick={() => {}} radius="small" color="red">
                      Delete
                    </Button>
                  </AlertDialog.Action>
                </Flex>
              </AlertDialog.Content>
            </AlertDialog.Root>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};
