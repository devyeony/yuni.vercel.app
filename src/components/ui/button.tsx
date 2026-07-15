import { Button as BaseButton } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-medium select-none",
    "transition-colors duration-(--duration-fast) ease-out-soft",
    "disabled:pointer-events-none disabled:opacity-45",
    // Touch target ≥ 44px on coarse pointers regardless of visual size.
    "pointer-coarse:min-h-11",
  ],
  {
    variants: {
      variant: {
        solid: "bg-accent text-accent-contrast hover:bg-accent-muted",
        outline:
          "border border-border text-text hover:border-accent hover:text-accent",
        ghost: "text-text-muted hover:bg-surface-raised hover:text-text",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends Omit<ComponentProps<typeof BaseButton>, "className">,
    VariantProps<typeof buttonVariants> {
  className?: string;
}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <BaseButton
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
