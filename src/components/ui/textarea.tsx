import { Field as BaseField } from "@base-ui/react/field";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/*
 * Rendered through Field.Control (the same primitive Base UI's Input wraps,
 * with graceful no-op context defaults) so label association, description
 * and error wiring work inside a Field — a bare <textarea> gets none of it.
 */
export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <BaseField.Control
      render={
        <textarea
          className={cn(
            "min-h-28 w-full rounded-sm border border-border bg-transparent px-3 py-2 text-base text-text",
            "transition-colors duration-(--duration-fast) placeholder:text-text-muted/70",
            "focus:border-accent aria-invalid:border-danger",
            className,
          )}
          {...props}
        />
      }
    />
  );
}
