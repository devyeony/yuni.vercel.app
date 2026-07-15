import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const textVariants = cva("text-pretty", {
  variants: {
    variant: {
      lead: "text-lead text-text",
      body: "text-base leading-relaxed text-text",
      muted: "text-base leading-relaxed text-text-muted",
      caption: "text-sm text-text-muted",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

export interface TextProps
  extends ComponentProps<"p">,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "div";
}

export function Text({
  as: Tag = "p",
  className,
  variant,
  ...props
}: TextProps) {
  return (
    <Tag className={cn(textVariants({ variant }), className)} {...props} />
  );
}
