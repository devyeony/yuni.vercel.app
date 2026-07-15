import { useTranslations } from "next-intl";
import { NavLink } from "@/components/nav-link";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Link } from "@/i18n/navigation";

export function SiteHeader() {
  const t = useTranslations("ui.nav");

  return (
    <header className="sticky top-0 z-40 border-b border-border-muted bg-surface">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2.5 focus:left-4 focus:z-50 focus:rounded-sm focus:bg-surface-raised focus:px-3 focus:py-2 focus:text-sm focus:text-text"
      >
        {t("skipToContent")}
      </a>
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6 md:px-10">
        <Link
          href="/"
          aria-label={t("home")}
          className="rounded-xs font-display text-xl font-semibold tracking-tight text-text"
        >
          yuni
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          <nav aria-label={t("primary")} className="flex items-center">
            <NavLink href="/about">{t("about")}</NavLink>
            <NavLink href="/design">{t("design")}</NavLink>
          </nav>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
