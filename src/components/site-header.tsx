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
      {/* Phone recomposes into two rows (wordmark + controls, then nav);
          sm and up collapses back to a single 14-unit bar. */}
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center px-4 py-2 sm:h-14 sm:flex-nowrap sm:px-6 sm:py-0 md:px-10">
        <Link
          href="/"
          aria-label={t("home")}
          className="order-1 rounded-xs font-display text-xl font-semibold tracking-tight text-text"
        >
          yuni
        </Link>
        <nav
          aria-label={t("primary")}
          className="order-3 -mx-2 flex w-full items-center sm:order-2 sm:mx-0 sm:ml-auto sm:w-auto"
        >
          <NavLink href="/projects">{t("projects")}</NavLink>
          <NavLink href="/about">{t("about")}</NavLink>
          <NavLink href="/design">{t("design")}</NavLink>
        </nav>
        <div className="order-2 ml-auto flex items-center gap-1 sm:order-3 sm:ml-3">
          <ThemeToggle />
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
