import { formOptions } from "@tanstack/react-form";

export const dashboardFormOptions = formOptions({
  defaultValues: {
    redirectRuleForm: {
      source: "",
      destination: "",
    },
    headerRuleForm: {
      key: "",
      value: "",
    },
    scriptForm: {
      body: "",
      id: "",
      runAt: "document_idle",
      allFrames: true,
      exclude: "",
      include: "",
    },
  },
});
