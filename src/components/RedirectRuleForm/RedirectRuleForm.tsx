import { dashboardFormOptions } from "@/contexts/dashboard-context.ts";
import { Box, Button, Flex } from "@radix-ui/themes";
import CardAddIcon from "../../assets/card-add.svg";
import { withForm } from "../../hooks/useForm/useForm";
import styles from "./RedirectRuleForm.module.scss";

export const RedirectRuleForm = withForm({
  ...dashboardFormOptions,
  render: ({ form }) => {
    const validators = {
      onChange: ({ value }: { value?: string }) =>
        value?.trim()?.length ? undefined : "Please enter a valid input.",
    };
    return (
      <Box className={styles.Card} p="2">
        <Flex gap="1" direction={"column"}>
          <Flex gap="1" direction={"column"}>
            <Flex direction={"row"}>
              <form.AppField
                validators={validators}
                name="source"
                children={(field) => (
                  <field.TextField
                    placeholder="Example: https://example.com/(.*)"
                    htmlFor="source"
                    label="Source"
                  />
                )}
              />
            </Flex>
            <form.AppField
              validators={validators}
              name="destination"
              children={(field) => (
                <field.TextField
                  placeholder="Example: https://google.com/$1"
                  htmlFor="source"
                  label="Destination"
                />
              )}
            />
          </Flex>
          <Flex flexGrow={"1"} justify={"end"}>
            <Button
              onClick={() =>
                form.handleSubmit({ submitAction: "redirect-rule" })
              }
              type="submit"
              size="1"
            >
              <CardAddIcon />
              Add config
            </Button>
          </Flex>
        </Flex>
      </Box>
    );
  },
});
