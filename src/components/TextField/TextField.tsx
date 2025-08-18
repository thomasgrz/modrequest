import { Box, Flex, TextField } from "@radix-ui/themes";
import { useStore } from "@tanstack/react-form";
import { Label } from "radix-ui";
import { useFieldContext } from "../../contexts/form-context";
import styles from "./TextField.module.scss";

export default function TextInput({
  label,
  htmlFor,
  placeholder,
}: {
  label: string;
  htmlFor: string;
  placeholder?: string;
}) {
  const field = useFieldContext<string>();

  const errors = useStore(field.store, (state) => state.meta.errors);
  console.log(field.state);
  return (
    <Box flexGrow={"1"}>
      <Flex gap={"1"} align={"center"}>
        <Label.Root className={styles.LabelRoot} htmlFor={htmlFor}>
          {label}:{" "}
        </Label.Root>
        <Box flexGrow={"1"}>
          <TextField.Root
            placeholder={placeholder}
            value={field.state.value}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
          />
        </Box>
      </Flex>
      {errors.map((error: string) => (
        <em key={error} style={{ color: "red" }}>
          {error}
        </em>
      ))}
    </Box>
  );
}
