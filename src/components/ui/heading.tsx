import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const headingVariants = cva("font-display text-balance text-text", {
  variants: {
    variant: {
      display: "text-display font-semibold tracking-tight",
      title: "text-title font-semibold tracking-tight",
      subtitle: "text-subtitle font-medium",
    },
  },
  defaultVariants: {
    variant: "title",
  },
});

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "p";

export interface HeadingProps
  extends ComponentProps<"h2">,
    VariantProps<typeof headingVariants> {
  /** Semantic level is independent of the visual variant. */
  as?: HeadingTag;
}

export function Heading({
  as: Tag = "h2",
  className,
  variant,
  ...props
}: HeadingProps) {
  return (
    <Tag className={cn(headingVariants({ variant }), className)} {...props} />
  );
}
