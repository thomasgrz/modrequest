import { formOptions } from "@tanstack/react-form";

export const dashboardFormOptions = formOptions({
  defaultValues: {
    source: "",
    destination: "",
  },
});
