import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-sm border border-border bg-transparent px-3 py-2 text-base text-text",
        "transition-colors duration-(--duration-fast) placeholder:text-text-muted/70",
        "focus:border-accent aria-invalid:border-danger",
        className,
      )}
      {...props}
    />
  );
}
