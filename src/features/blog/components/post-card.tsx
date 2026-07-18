import { useLocale, useTranslations } from "next-intl";
import { Heading } from "@/components/ui/heading";
import { Tag } from "@/components/ui/tag";
import { Text } from "@/components/ui/text";
import type { Post } from "@/features/blog/lib/collection";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/dates";

/** Editorial list row — the article link carries the title; tags stay quiet. */
export function PostCard({ post }: { post: Post }) {
  const t = useTranslations("blog");
  const locale = useLocale() as Locale;

  return (
    <article className="flex flex-col gap-2">
      <Text as="span" variant="caption">
        {formatDate(locale, post.date)} ·{" "}
        {t("readingTime", { minutes: post.readingMinutes })}
      </Text>
      <Heading as="h2" variant="subtitle">
        <Link
          href={`/blog/${post.slug}`}
          className="rounded-xs transition-colors duration-(--duration-fast) ease-out-soft hover:text-accent"
        >
          {post.title}
        </Link>
      </Heading>
      <Text variant="muted" className="max-w-prose">
        {post.summary}
      </Text>
      {post.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      )}
    </article>
  );
}
