import { render } from "@testing-library/react";
import { describe, it } from "vitest";
import { HeaderForm } from "./HeaderForm";

describe("HeaderForm", () => {
  it("should display all inputs", () => {
    render(<HeaderForm />);
  });
});
