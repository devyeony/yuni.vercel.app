import { Input as BaseInput } from "@base-ui/react/input";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export interface InputProps
  extends Omit<ComponentProps<typeof BaseInput>, "className"> {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return (
    <BaseInput
      className={cn(
        "h-10 w-full rounded-sm border border-border bg-transparent px-3 text-base text-text",
        "transition-colors duration-(--duration-fast) placeholder:text-text-muted/70",
        "focus:border-accent aria-invalid:border-danger pointer-coarse:min-h-11",
        className,
      )}
      {...props}
    />
  );
}
