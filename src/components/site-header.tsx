import { useTranslations } from "next-intl";
import { MobileNav } from "@/components/mobile-nav";
import { NavLink } from "@/components/nav-link";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { SearchDialog } from "@/features/search/components/search-dialog";
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
      {/* Single bar on every device class; below `md` the nav recomposes
          into a hamburger sheet (MobileNav) instead of an overflowing row —
          six inline items measure ~395 px, which no longer fits next to the
          wordmark and controls at 640 px. */}
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-4 sm:px-6 md:px-10">
        <Link
          href="/"
          aria-label={t("home")}
          className="rounded-xs font-display text-xl font-semibold tracking-tight text-text"
        >
          yuni
        </Link>
        <nav
          aria-label={t("primary")}
          className="ml-auto hidden items-center md:flex"
        >
          <NavLink href="/projects">{t("projects")}</NavLink>
          <NavLink href="/blog">{t("blog")}</NavLink>
          <NavLink href="/about">{t("about")}</NavLink>
          <NavLink href="/design">{t("design")}</NavLink>
          <NavLink href="/embeddings">{t("embeddings")}</NavLink>
          <NavLink href="/contact">{t("contact")}</NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-1 md:ml-3">
          <SearchDialog />
          <ThemeToggle />
          <LocaleSwitcher />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
