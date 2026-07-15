import { Field as BaseField } from "@base-ui/react/field";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/*
 * Form field primitives (Base UI Field): label association, description and
 * validation error wiring are handled by the primitive; the Input/Textarea
 * components integrate as controls automatically.
 */

type WithClassName<T> = Omit<T, "className"> & { className?: string };

export function Field({
  className,
  ...props
}: WithClassName<ComponentProps<typeof BaseField.Root>>) {
  return (
    <BaseField.Root
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

export function FieldLabel({
  className,
  ...props
}: WithClassName<ComponentProps<typeof BaseField.Label>>) {
  return (
    <BaseField.Label
      className={cn("text-sm font-medium text-text", className)}
      {...props}
    />
  );
}

export function FieldDescription({
  className,
  ...props
}: WithClassName<ComponentProps<typeof BaseField.Description>>) {
  return (
    <BaseField.Description
      className={cn("text-sm text-text-muted", className)}
      {...props}
    />
  );
}

export function FieldError({
  className,
  ...props
}: WithClassName<ComponentProps<typeof BaseField.Error>>) {
  return (
    <BaseField.Error
      className={cn("text-sm text-danger", className)}
      {...props}
    />
  );
}
