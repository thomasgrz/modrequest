import { TrashIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex } from "@radix-ui/themes";
import Pause from "../../assets/pause.svg";
import Play from "../../assets/play.svg";
import Refresh from "../../assets/refresh.svg";
import styles from "./DashboardControls.module.scss";

export const DashboardControls = ({
  allPaused,
  onDeleteAllRules,
  onPauseAllRules,
  onResumeAllRules,
  onSyncAllRules,
}: {
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
        <Button
          size={"3"}
          className={styles.DeleteAllRules}
          color="red"
          onClick={onDeleteAllRules}
        >
          <TrashIcon />
          Delete
        </Button>
      </Flex>
    </Box>
  );
};
