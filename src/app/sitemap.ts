import type { MetadataRoute } from "next";
import { postsForLocale, tagsForLocale } from "@/features/blog/lib/collection";
import { projectsForLocale } from "@/features/projects/lib/collection";
import { getPathname } from "@/i18n/navigation";
import { type Locale, routing } from "@/i18n/routing";
import { site } from "@/lib/site";

/*
 * Locale-aware sitemap: every entry lists its language alternates, mirroring
 * the hreflang tags emitted by lib/seo. Content routes derive from the same
 * collections that render the pages, so new entries join without edits here.
 */

const staticRoutes = [
  "/",
  "/about",
  "/projects",
  "/blog",
  "/design",
  "/embeddings",
  "/contact",
  "/colophon",
];

function absolute(locale: Locale, href: string): string {
  return site.url + getPathname({ locale, href });
}

function entry(
  href: string,
  locales: readonly Locale[],
  lastModified?: string,
): MetadataRoute.Sitemap[number] {
  const primary = locales.includes(routing.defaultLocale)
    ? routing.defaultLocale
    : (locales[0] as Locale);
  return {
    url: absolute(primary, href),
    ...(lastModified ? { lastModified: new Date(lastModified) } : {}),
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, absolute(locale, href)]),
      ),
    },
  };
}

/** One entry per slug across locales; alternates only where the pair exists. */
function contentEntries(
  slugsFor: (locale: Locale) => ReadonlyArray<{
    slug: string;
    date?: string;
  }>,
  hrefFor: (slug: string) => string,
): MetadataRoute.Sitemap {
  const byLocale = routing.locales.map(
    (locale) => [locale, slugsFor(locale)] as const,
  );
  const slugs = [
    ...new Set(byLocale.flatMap(([, items]) => items.map((i) => i.slug))),
  ];
  return slugs.map((slug) => {
    const present = byLocale.filter(([, items]) =>
      items.some((i) => i.slug === slug),
    );
    const date = present
      .flatMap(([, items]) => items.filter((i) => i.slug === slug))
      .map((i) => i.date)
      .find(Boolean);
    return entry(
      hrefFor(slug),
      present.map(([locale]) => locale),
      date,
    );
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((href) => entry(href, routing.locales)),
    ...contentEntries(
      (locale) => projectsForLocale(locale),
      (slug) => `/projects/${slug}`,
    ),
    ...contentEntries(
      (locale) => postsForLocale(locale),
      (slug) => `/blog/${slug}`,
    ),
    ...contentEntries(
      (locale) => tagsForLocale(locale).map((tag) => ({ slug: tag })),
      (tag) => `/blog/tags/${encodeURIComponent(tag)}`,
    ),
  ];
}
