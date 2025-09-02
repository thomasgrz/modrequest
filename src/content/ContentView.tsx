import { RedirectRule, RuleCard } from "@/components/RuleCard/RuleCard";
import { subscribeToRuleChanges } from "@/utils/subscribeToRuleChanges/subscribeToRuleChanges";
import { Box, Button, Flex, IconButton, Theme } from "@radix-ui/themes";
import { Separator } from "radix-ui";
import { useEffect, useState } from "react";
import Hide from "../assets/hide.svg";
import Show from "../assets/show.svg";
import styles from "./ContentView.module.scss";

export const ContentView = () => {
  const [show, setShow] = useState(true);
  const [displayedRules, setDisplayedRules] = useState<RedirectRule[]>([]);

  const fetchRules = async () => {
    const _rules = await chrome.storage.local.get("rules");
    setDisplayedRules(_rules.rules);
  };

  const toggle = () => {
    setShow(!show);
    fetchRules();
  };

  useEffect(() => {
    fetchRules();
  }, []);

  useEffect(() => {
    subscribeToRuleChanges((changes) => setDisplayedRules(changes.newValue));
  }, []);

  return (
    <Theme>
      <Box className={styles.ContentView}>
        <Flex align="end" direction={"row"}>
          <div
            data-ui-shown={show}
            className={show ? styles.DisplayedRules : styles.HiddenRules}
          >
            {displayedRules?.map?.((rule) => (
              <RuleCard key={rule.details.id} rule={rule} />
            ))}
          </div>
          <Separator.Root />
          <Flex gap="1">
            <Button onClick={() => fetchRules()}> Refresh</Button>
            <IconButton color="green" onClick={toggle}>
              {show ? <Hide /> : <Show />}
            </IconButton>
          </Flex>
        </Flex>
      </Box>
    </Theme>
  );
};
