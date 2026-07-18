import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";

/**
 * schema.org JSON-LD for the whole site: one Person node (the entity search
 * engines should attribute every page to) plus the WebSite that belongs to
 * them. Rendered once in the locale layout; `description` carries the
 * localized anchor line from `meta.description`.
 */
export function profileJsonLd(description: string) {
  const personId = `${site.url}/#person`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": personId,
        name: site.author,
        alternateName: ["yuni", "김연희"],
        jobTitle: "Software Engineer",
        description,
        url: site.url,
        email: site.social.email,
        sameAs: [site.social.github, site.social.linkedin],
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        name: site.name,
        url: site.url,
        inLanguage: [...routing.locales],
        author: { "@id": personId },
      },
    ],
  };
}

/** Serialize for a JSON-LD script tag; `<` is escaped so markup can't leak out. */
export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replaceAll("<", "\\u003c");
}
