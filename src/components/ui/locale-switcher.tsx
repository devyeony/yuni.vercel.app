"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export function LocaleSwitcher() {
  const t = useTranslations("ui.localeSwitcher");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <nav aria-label={t("label")} className="flex items-center gap-1">
      {routing.locales.map((candidate) => {
        const isActive = candidate === locale;
        return (
          <Link
            key={candidate}
            href={pathname}
            locale={candidate}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "inline-flex min-h-8 items-center rounded-xs px-2 font-mono text-xs tracking-wider uppercase",
              "transition-colors duration-(--duration-fast) pointer-coarse:min-h-11",
              isActive ? "text-text" : "text-text-muted hover:text-text",
            )}
          >
            {candidate}
          </Link>
        );
      })}
    </nav>
  );
}
