import { type Locale, routing } from "@/i18n/routing";

/**
 * Canonical + hreflang alternates for a localized page. `path` is the
 * locale-less route ("" for home, "/about", …); URLs resolve against
 * `metadataBase` set in the locale layout.
 */
export function localeAlternates(locale: Locale, path = "") {
  const href = (l: Locale) => `/${l}${path}`;
  return {
    canonical: href(locale),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, href(l)])),
      "x-default": href(routing.defaultLocale),
    },
  };
}
