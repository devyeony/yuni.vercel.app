"use server";

import { headers } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";
import { site } from "@/lib/site";
import {
  type ContactField,
  type ContactState,
  contactSchema,
  readContactValues,
} from "./schema";

/*
 * Delivery goes through Resend's plain HTTP API (free tier, no SDK). The
 * key is optional infrastructure: without RESEND_API_KEY the action reports
 * "failed" and the UI falls back to the direct email link — never a fake
 * success.
 */
const RESEND_ENDPOINT = "https://api.resend.com/emails";

export async function sendContactMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: humans never see the "company" field. Report success so bots
  // don't learn the tell.
  if (formData.get("company")) return { status: "sent" };

  const values = readContactValues(formData);

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const gate = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!gate.ok) return { status: "rate-limited", values };

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const fields = [
      ...new Set(parsed.error.issues.map((issue) => String(issue.path[0]))),
    ] as ContactField[];
    return { status: "invalid", fields, values };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { status: "failed", values };

  const { name, email, purpose, message } = parsed.data;
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Portfolio contact <onboarding@resend.dev>",
      to: [
        process.env.CONTACT_TO_EMAIL ??
          site.social.email.replace("mailto:", ""),
      ],
      reply_to: email,
      subject: `[${purpose}] ${name} — via ${site.url.replace("https://", "")}`,
      text: `From: ${name} <${email}>\nPurpose: ${purpose}\n\n${message}`,
    }),
  }).catch(() => null);

  if (!response?.ok) {
    // Status only — message content and sender identity stay out of logs.
    console.error(`contact: delivery failed (${response?.status ?? "fetch"})`);
    return { status: "failed", values };
  }
  return { status: "sent" };
}
