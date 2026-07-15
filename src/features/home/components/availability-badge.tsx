import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { now } from "../lib/now";

export function AvailabilityBadge({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const { availability } = now;
  if (!availability.open) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 rounded-full border border-border px-3.5 py-1.5 font-mono text-xs tracking-wider text-text-muted uppercase",
        className,
      )}
    >
      <span className="relative flex size-2" aria-hidden="true">
        {/* animate-ping bakes its own duration, so the token-collapse
            reduced-motion strategy can't reach it — kill it explicitly. */}
        <span className="absolute inset-0 animate-ping rounded-full bg-accent opacity-75 motion-reduce:animate-none" />
        <span className="relative size-2 rounded-full bg-accent" />
      </span>
      {availability.label[locale]}
    </span>
  );
}
