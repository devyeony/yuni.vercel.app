import { describe, expect, it } from "vitest";
import { contactSchema, readContactValues } from "./schema";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  purpose: "hiring",
  message: "I'd like to talk about a backend role on our team.",
};

describe("contactSchema", () => {
  it("accepts a complete submission", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("trims whitespace before validating", () => {
    const parsed = contactSchema.parse({
      ...valid,
      name: "  Ada  ",
      message: `  ${valid.message}  `,
    });
    expect(parsed.name).toBe("Ada");
    expect(parsed.message).toBe(valid.message);
  });

  it.each([
    ["name", { name: "   " }],
    ["email", { email: "not-an-email" }],
    ["purpose", { purpose: "spam" }],
    ["message", { message: "hi" }],
  ])("rejects an invalid %s and reports the field", (field, override) => {
    const result = contactSchema.safeParse({ ...valid, ...override });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toContain(
        field,
      );
    }
  });
});

describe("readContactValues", () => {
  it("echoes submitted fields and defaults missing ones to empty strings", () => {
    const formData = new FormData();
    formData.set("name", "Ada");
    formData.set("purpose", "coffee");
    expect(readContactValues(formData)).toEqual({
      name: "Ada",
      email: "",
      purpose: "coffee",
      message: "",
    });
  });
});
