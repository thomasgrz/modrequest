import { TrashIcon } from "@radix-ui/react-icons";
import { AlertDialog, Box, Button, Flex } from "@radix-ui/themes";
import Pause from "../../assets/pause.svg";
import Play from "../../assets/play.svg";
import Refresh from "../../assets/refresh.svg";
import styles from "./DashboardControls.module.scss";

export const DashboardControls = ({
  ruleCount,
  allPaused,
  onDeleteAllRules,
  onPauseAllRules,
  onResumeAllRules,
  onSyncAllRules,
}: {
  ruleCount?: number;
  onSyncAllRules: () => void;
  onDeleteAllRules: () => void;
  onPauseAllRules: () => void;
  onResumeAllRules: () => void;
  allPaused: boolean;
}) => {
  return (
    <Box p="1">
      <Flex justify={"between"} flexGrow={"1"} width="100%">
        {allPaused ? (
          <Button
            disabled={!ruleCount}
            size={"3"}
            className={styles.ResumeAllRules}
            color="green"
            onClick={onResumeAllRules}
          >
            <Play />
            Resume
          </Button>
        ) : (
          <Button
            disabled={!ruleCount}
            size={"3"}
            className={styles.PauseAllRules}
            color="blue"
            onClick={onPauseAllRules}
          >
            <Pause />
            Pause
          </Button>
        )}
        <Button
          className={styles.SyncAllRules}
          size={"3"}
          onClick={onSyncAllRules}
        >
          <Refresh />
          Sync
        </Button>
        <AlertDialog.Root>
          <AlertDialog.Trigger>
            <Button
              disabled={!ruleCount}
              size={"3"}
              className={styles.DeleteAllRules}
              color="red"
            >
              <TrashIcon />
              Delete
            </Button>
          </AlertDialog.Trigger>
          <AlertDialog.Content>
            <AlertDialog.Title>Delete all rules forever?</AlertDialog.Title>
            <AlertDialog.Description>
              You can also just pause all rules
            </AlertDialog.Description>
            <Flex p="3" justify={"between"}>
              <AlertDialog.Cancel>
                <Button radius="small" variant="soft" color="gray">
                  Exit
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action onClick={onDeleteAllRules}>
                <Button onClick={onDeleteAllRules} radius="small" color="red">
                  Delete
                </Button>
              </AlertDialog.Action>
            </Flex>
          </AlertDialog.Content>
        </AlertDialog.Root>
      </Flex>
    </Box>
  );
};
