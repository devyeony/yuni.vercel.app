import { z } from "zod";

/*
 * Contact form boundary schema. Client-side HTML validation is a UX layer
 * only — this is the enforcement point (server action).
 */

export const purposes = ["hiring", "collaboration", "coffee"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(200),
  purpose: z.enum(purposes),
  message: z.string().trim().min(10).max(5000),
});

type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

/** Submitted raw values, echoed back so the form can repopulate on error. */
export type ContactValues = Record<ContactField, string>;

export function readContactValues(formData: FormData): ContactValues {
  return {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    purpose: String(formData.get("purpose") ?? ""),
    message: String(formData.get("message") ?? ""),
  };
}

export type ContactState =
  | { status: "idle" }
  | { status: "sent" }
  | { status: "invalid"; fields: ContactField[]; values: ContactValues }
  | { status: "rate-limited"; values: ContactValues }
  // Delivery not configured (no API key) or the provider call failed —
  // surfaced honestly with a direct-email fallback, never a fake success.
  | { status: "failed"; values: ContactValues };
