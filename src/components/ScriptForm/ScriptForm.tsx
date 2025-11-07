import { dashboardFormOptions } from "@/contexts/dashboard-context";
import { withForm } from "@/hooks/useForm/useForm";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex } from "@radix-ui/themes";

export const ScriptForm = withForm({
  ...dashboardFormOptions,
  render: ({ form }) => {
    const validators = {
      onChange: ({ value }: { value?: string }) =>
        value?.trim()?.length ? undefined : "Please enter a valid input.",
    };

    return (
      <Box p="2">
        <Flex gap="1" direction={"column"}>
          <form.AppField validators={validators} name="script">
            {(field) => (
              <field.TextArea
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="console.log(something);"
              />
            )}
          </form.AppField>
          <Flex flexGrow={"1"} justify={"end"}>
            <Button
              color="yellow"
              variant="outline"
              onClick={() =>
                form.handleSubmit({ submitAction: "create-script" })
              }
              type="submit"
              size="2"
            >
              <PlusCircledIcon />
              Create script
            </Button>
          </Flex>
        </Flex>
      </Box>
    );
  },
});
