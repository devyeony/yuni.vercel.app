import { allPosts, type Post } from "content-collections";
import type { Locale } from "@/i18n/routing";

export type { Post };

export function postsForLocale(locale: Locale): Post[] {
  return allPosts
    .filter((post) => post.locale === locale && !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function postBySlug(locale: Locale, slug: string): Post | undefined {
  return allPosts.find(
    (post) => post.locale === locale && post.slug === slug && !post.draft,
  );
}

export function tagsForLocale(locale: Locale): string[] {
  return [...new Set(postsForLocale(locale).flatMap((post) => post.tags))].sort(
    (a, b) => a.localeCompare(b),
  );
}

export function postsForTag(locale: Locale, tag: string): Post[] {
  return postsForLocale(locale).filter((post) => post.tags.includes(tag));
}
