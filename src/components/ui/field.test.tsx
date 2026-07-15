import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { renderWithIntl } from "@/test/render";

describe("Field", () => {
  it("associates label and description with the input", () => {
    renderWithIntl(
      <Field name="email">
        <FieldLabel>Email</FieldLabel>
        <Input type="email" />
        <FieldDescription>Used only to reply.</FieldDescription>
      </Field>,
    );
    const input = screen.getByLabelText("Email");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAccessibleDescription("Used only to reply.");
  });
});
