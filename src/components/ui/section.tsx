import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/**
 * Vertical rhythm unit of every page: fluid block padding (token-driven)
 * plus a centered readable measure. Width adapts per device class via the
 * inner container, not by scaling one layout.
 */
export function Section({
  className,
  children,
  ...props
}: ComponentProps<"section">) {
  return (
    <section className={cn("px-6 py-section md:px-10", className)} {...props}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}
