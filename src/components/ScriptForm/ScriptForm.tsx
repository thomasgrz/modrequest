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
          <form.AppField validators={validators} name="scriptForm.body">
            {(field) => (
              <field.TextArea placeholder="console.log(something);" />
            )}
          </form.AppField>
          <form.AppField validators={validators} name="scriptForm.id">
            {(field) => (
              <field.TextField
                htmlFor="Id"
                label="Id"
                placeholder="My_first_script"
              />
            )}
          </form.AppField>
          <form.AppField name="scriptForm.runAt">
            {(field) => (
              <field.TextField
                htmlFor="Run At"
                label="Run At"
                placeholder="document_idle"
              />
            )}
          </form.AppField>
          <form.AppField name="scriptForm.allFrames">
            {(field) => (
              <field.TextField
                htmlFor="All Frames"
                label="All Frames"
                placeholder="true"
              />
            )}
          </form.AppField>
          <form.AppField name="scriptForm.matches">
            {(field) => (
              <field.TextField
                htmlFor="Matches"
                label="Matches"
                placeholder="*://*/*"
              />
            )}
          </form.AppField>
          <form.AppField name="scriptForm.exclude">
            {(field) => (
              <field.TextField
                htmlFor="Exclude Globs"
                label="Exclude Globs"
                placeholder='["*://*.example.com/*"]'
              />
            )}
          </form.AppField>
          <form.AppField name="scriptForm.include">
            {(field) => (
              <field.TextField
                htmlFor="Include Globs"
                label="Include Globs"
                placeholder='["*://*.example.com/*"]'
              />
            )}
          </form.AppField>
          <Flex flexGrow={"1"} justify={"end"} direction={"row"}>
            <Button
              color="yellow"
              variant="outline"
              onClick={() =>
                form.handleSubmit({ submitAction: "create-script" })
              }
              type="button"
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
