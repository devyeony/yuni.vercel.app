import { useTranslations } from "next-intl";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { site } from "@/lib/site";

const footerLinkClasses = "font-mono text-xs tracking-wider uppercase";

export function SiteFooter() {
  const t = useTranslations("ui.footer");

  return (
    <footer className="border-t border-border-muted">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        {/* The colophon sits with the imprint line, as in a book — the
            "Elsewhere" nav stays external-only. */}
        <Text variant="caption" as="p">
          © {new Date().getFullYear()} {site.author} ·{" "}
          <Link variant="muted" href="/colophon" className={footerLinkClasses}>
            {t("colophon")}
          </Link>
        </Text>
        <nav aria-label={t("label")} className="flex items-center gap-5">
          <Link
            variant="muted"
            href={site.social.github}
            className={footerLinkClasses}
          >
            GitHub
          </Link>
          <Link
            variant="muted"
            href={site.social.linkedin}
            className={footerLinkClasses}
          >
            LinkedIn
          </Link>
          <Link variant="muted" href={site.repo} className={footerLinkClasses}>
            {t("source")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
