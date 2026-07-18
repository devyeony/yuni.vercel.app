import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Tag } from "@/components/ui/tag";
import { Text } from "@/components/ui/text";
import { PostCard } from "@/features/blog/components/post-card";
import { postsForLocale, tagsForLocale } from "@/features/blog/lib/collection";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("title"),
    alternates: localeAlternates(locale as Locale, "/blog"),
  };
}

export default function BlogPage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("blog");
  const activeLocale = useLocale() as Locale;
  const posts = postsForLocale(activeLocale);
  const tags = tagsForLocale(activeLocale);

  return (
    <main id="main" className="flex-1">
      <Section>
        <Heading as="h1" variant="display">
          {t("title")}
        </Heading>
        <Text variant="muted" className="mt-4 max-w-2xl">
          {t("intro")}
        </Text>
        {tags.length > 0 && (
          <nav aria-label={t("tags")} className="mt-8 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog/tags/${encodeURIComponent(tag)}`}
                className="rounded-xs"
              >
                <Tag className="transition-colors duration-(--duration-fast) ease-out-soft hover:border-accent/40 hover:text-accent">
                  {tag}
                </Tag>
              </Link>
            ))}
          </nav>
        )}
        <div className="mt-14 flex max-w-3xl flex-col gap-12">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </Section>
    </main>
  );
}
