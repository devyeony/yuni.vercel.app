import { Feed } from "feed";
import { postsForLocale } from "@/features/blog/lib/collection";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { site } from "@/lib/site";

/**
 * RSS/Atom feed per locale — the blog publishes over standard protocols,
 * not a platform. URLs go through getPathname so the as-needed locale
 * prefix stays consistent with the site's routing.
 */
export function buildFeed(locale: Locale): Feed {
  const posts = postsForLocale(locale);
  const url = (path: string) =>
    `${site.url}${getPathname({ locale, href: path })}`;

  const feed = new Feed({
    id: url("/blog"),
    link: url("/blog"),
    title: `${site.name} — blog`,
    description:
      locale === "ko"
        ? "소프트웨어를 만들며 남기는 기록"
        : "Notes from building software",
    language: locale,
    copyright: `© ${new Date().getFullYear()} ${site.author}`,
    updated: posts[0] ? new Date(`${posts[0].date}T00:00:00Z`) : undefined,
    author: { name: site.author, link: site.url },
  });

  for (const post of posts) {
    feed.addItem({
      id: url(`/blog/${post.slug}`),
      link: url(`/blog/${post.slug}`),
      title: post.title,
      description: post.summary,
      date: new Date(`${post.date}T00:00:00Z`),
      category: post.tags.map((name) => ({ name })),
    });
  }

  return feed;
}
