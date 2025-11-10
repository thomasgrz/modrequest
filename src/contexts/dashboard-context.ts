import { formOptions } from "@tanstack/react-form";

export const dashboardFormOptions = formOptions({
  defaultValues: {
    redirectRuleForm: {
      name: "",
      source: "",
      destination: "",
    },
    headerRuleForm: {
      name: "",
      key: "",
      value: "",
    },
    scriptForm: {
      name: "",
      body: "",
      id: "",
      runAt: "document_idle",
      allFrames: true,
      matches: "",
      exclude: "",
      include: "",
    },
  },
});
