import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/*
 * Tooltips open on hover *and* keyboard focus (Base UI behavior), so they are
 * never hover-only. Content must stay supplementary — never the only way to
 * reach information (touch devices may not show it).
 */
export const TooltipProvider = BaseTooltip.Provider;
export const Tooltip = BaseTooltip.Root;
export const TooltipTrigger = BaseTooltip.Trigger;

export function TooltipContent({
  className,
  side = "top",
  children,
}: {
  className?: string;
  side?: "top" | "right" | "bottom" | "left";
  children: ReactNode;
}) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner side={side} sideOffset={8}>
        <BaseTooltip.Popup
          className={cn(
            "rounded-sm border border-border-muted bg-surface-raised px-2.5 py-1.5 text-xs text-text-muted",
            "transition-[opacity,transform] duration-(--duration-fast) ease-out-soft",
            "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
            className,
          )}
        >
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
}
