import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

export const Dialog = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogClose = BaseDialog.Close;

export function DialogContent({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <BaseDialog.Portal>
      {/* z-50: dialogs layer above the sticky site header (z-40). */}
      <BaseDialog.Backdrop
        className={cn(
          "fixed inset-0 z-50 bg-surface-overlay",
          "transition-opacity duration-(--duration-base) ease-out-soft",
          "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0",
        )}
      />
      <BaseDialog.Popup
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2",
          "rounded-md border border-border bg-surface-raised p-6",
          "transition-[opacity,transform] duration-(--duration-base) ease-out-soft",
          "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
          "data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
          className,
        )}
      >
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

export function DialogTitle({
  className,
  ...props
}: Omit<ComponentProps<typeof BaseDialog.Title>, "className"> & {
  className?: string;
}) {
  return (
    <BaseDialog.Title
      className={cn(
        "font-display text-subtitle font-medium text-text",
        className,
      )}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: Omit<ComponentProps<typeof BaseDialog.Description>, "className"> & {
  className?: string;
}) {
  return (
    <BaseDialog.Description
      className={cn(
        "mt-2 text-base leading-relaxed text-text-muted",
        className,
      )}
      {...props}
    />
  );
}
