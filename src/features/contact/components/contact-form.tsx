"use client";

import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { sendContactMessage } from "@/features/contact/lib/actions";
import {
  type ContactField,
  type ContactState,
  purposes,
} from "@/features/contact/lib/schema";
import { site } from "@/lib/site";

/*
 * Client leaf: useActionState round-trips the server action. Submitted
 * values come back in the action state so React 19's automatic form reset
 * repopulates the fields instead of wiping them on a validation error.
 */

const initialState: ContactState = { status: "idle" };

const purposePillClasses = [
  "inline-flex cursor-pointer items-center rounded-sm border border-border px-4 py-2 text-sm text-text-muted select-none",
  "transition-colors duration-(--duration-fast) ease-out-soft hover:text-text",
  "has-checked:border-accent has-checked:text-accent",
  "has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent",
  "pointer-coarse:min-h-11",
].join(" ");

export function ContactForm() {
  const t = useTranslations("contact.form");
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    initialState,
  );

  if (state.status === "sent") {
    return (
      <div role="status" className="max-w-xl">
        <Heading as="h2" variant="title">
          {t("sentTitle")}
        </Heading>
        <Text variant="muted" className="mt-4">
          {t("sentBody")}
        </Text>
      </div>
    );
  }

  const values = "values" in state ? state.values : undefined;
  const isInvalid = (field: ContactField) =>
    state.status === "invalid" && state.fields.includes(field);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field name="name" invalid={isInvalid("name")}>
          <FieldLabel>{t("nameLabel")}</FieldLabel>
          <Input
            name="name"
            defaultValue={values?.name}
            required
            maxLength={120}
            autoComplete="name"
          />
          {isInvalid("name") && (
            <FieldError match>{t("errors.name")}</FieldError>
          )}
        </Field>
        <Field name="email" invalid={isInvalid("email")}>
          <FieldLabel>{t("emailLabel")}</FieldLabel>
          <Input
            name="email"
            type="email"
            defaultValue={values?.email}
            required
            maxLength={200}
            autoComplete="email"
          />
          {isInvalid("email") && (
            <FieldError match>{t("errors.email")}</FieldError>
          )}
        </Field>
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-text">
          {t("purposeLegend")}
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {purposes.map((purpose) => (
            <label key={purpose} className={purposePillClasses}>
              <input
                type="radio"
                name="purpose"
                value={purpose}
                defaultChecked={
                  values?.purpose
                    ? purpose === values.purpose
                    : purpose === "hiring"
                }
                className="sr-only"
              />
              {t(`purpose.${purpose}`)}
            </label>
          ))}
        </div>
      </fieldset>

      <Field name="message" invalid={isInvalid("message")}>
        <FieldLabel>{t("messageLabel")}</FieldLabel>
        <Textarea
          name="message"
          defaultValue={values?.message}
          required
          minLength={10}
          maxLength={5000}
          rows={6}
        />
        {isInvalid("message") && (
          <FieldError match>{t("errors.message")}</FieldError>
        )}
      </Field>

      {/* Honeypot — invisible to people (and their screen readers), left
          untranslated on purpose. A filled value short-circuits delivery. */}
      <div aria-hidden="true" className="hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={pending} className="self-start">
          {pending ? t("sending") : t("submit")}
        </Button>
        <div aria-live="polite" className="text-sm">
          {state.status === "failed" && (
            <Text variant="caption" as="span" className="text-danger">
              {t("failed")}{" "}
              <Link href={site.social.email} variant="accent">
                {t("failedFallback")}
              </Link>
            </Text>
          )}
          {state.status === "rate-limited" && (
            <Text variant="caption" as="span" className="text-danger">
              {t("rateLimited")}
            </Text>
          )}
        </div>
      </div>
    </form>
  );
}
