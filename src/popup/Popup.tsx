import { Dashboard } from "@/components/Dashboard/Dashboard";
import { Theme } from "@radix-ui/themes";
import styles from "./Popup.module.scss";

export const Popup = () => {
  return (
    <Theme className={styles["pseudo-root"]} radius="full">
      <Dashboard showRules={false} />
    </Theme>
  );
};
