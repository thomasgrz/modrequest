import { Box, Flex, TextArea as _TextArea } from "@radix-ui/themes";
import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "../../contexts/form-context";

export default function TextArea({ placeholder }: { placeholder?: string }) {
  const field = useFieldContext<string>();

  const errors = useStore(field.store, (state) => state.meta.errors);
  return (
    <Box flexGrow={"1"}>
      <Flex gap={"1"} align={"center"}>
        <Box flexGrow={"1"}>
          <_TextArea
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
