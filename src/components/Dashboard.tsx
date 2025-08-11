import { dashboardFormOptions } from "@/contexts/dashboard-context";
import { useAppForm } from "@/hooks/useForm/useForm";
import {
  Box,
  Button,
  Container,
  Flex
} from "@radix-ui/themes";
import { useEffect, useState } from "react";

import { generateRedirectRuleId } from "@/utils/generateRedirectRuleId";
import { logger } from "@/utils/logger";
import styles from './Dashboard.module.scss';
import { RedirectRuleForm } from "./RedirectRuleForm/RedirectRuleForm";
import { RuleCard } from "./RuleCard/RuleCard";

export const Dashboard = () => {

  const [rulesInStorage, setRulesInStorage] = useState<chrome.declarativeNetRequest.Rule[]>([]);

  const fetchRules = async () => {
    const rules = await chrome.declarativeNetRequest.getDynamicRules();
    logger('fetched rules: ', rules)
    setRulesInStorage(rules)
  }

  const setRules = (rules: chrome.declarativeNetRequest.Rule[]) => {
    return chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules
    }, () => {
      fetchRules();
    })
  }

  const createRedirectRule = (rule: { source: string; destination: string }): chrome.declarativeNetRequest.Rule => {
    return {
      action: {
        type: 'redirect',
        redirect: {
          url: rule.destination,
        },
      },
      condition: {
        regexFilter: rule.source,
      },
      id: generateRedirectRuleId()
    }
  };

  useEffect(() => {
    fetchRules();
  }, [])

  const form = useAppForm({
    ...dashboardFormOptions,
    validators: {
      // onChange: async (...args) => {
      //   // value.configs.every((value) => value.source && value.destination);
      // },
    },
    onSubmitMeta: {
      submitAction: null
    },
    onSubmit: async ({ value, meta }) => {
      logger(`Selected action - ${meta.submitAction}`, value);
      if (meta.submitAction === 'redirect-rule') {
        setRules([createRedirectRule(value)])
        return;
      }
    },
  });

  return (
    <div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          // await form.handleSubmit();
          logger('test', null)
        }}
      >
        <Container className={styles.Dashboard}>
          <Box p="1">
            <Flex justify={"between"} flexGrow={"1"} width="100%">
              <Button size="1" onClick={() => {
                (async () => {
                  const rules = await chrome.declarativeNetRequest.getDynamicRules();
                  const rulesToDisable = rules.map(rule => rule.id);
                  console.log({ rulesToDisable });
                })()
              }}>
                clear configs
              </Button>
            </Flex>
          </Box>
          <Box>
            <RedirectRuleForm form={form} />
          </Box>
          {rulesInStorage?.map((rule) => {
            return (
              <RuleCard rule={rule} onClick={async () => {
                await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [rule?.id] })
                setRulesInStorage(prev => prev.filter(r => r.id !== rule.id))
              }} />
            )
          })
          }
        </Container>
      </form>
    </div>
  );
};
