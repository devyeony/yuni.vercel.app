import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const tagVariants = cva(
  "inline-flex items-center gap-1 rounded-xs border px-2 py-0.5 font-mono text-xs tracking-wider uppercase",
  {
    variants: {
      variant: {
        default: "border-border text-text-muted",
        accent: "border-accent/40 text-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface TagProps
  extends ComponentProps<"span">,
    VariantProps<typeof tagVariants> {}

export function Tag({ className, variant, ...props }: TagProps) {
  return (
    <span className={cn(tagVariants({ variant }), className)} {...props} />
  );
}
