import { MDXContent } from "@content-collections/mdx/react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { Tag } from "@/components/ui/tag";
import { Text } from "@/components/ui/text";
import { postBySlug, postsForLocale } from "@/features/blog/lib/collection";
import { RelatedContent } from "@/features/related/components/related-content";
import { relatedFor } from "@/features/related/lib/related";
import type { Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/dates";
import { localeAlternates } from "@/lib/seo";

export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  return postsForLocale(params.locale as Locale).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = postBySlug(locale as Locale, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: localeAlternates(locale as Locale, `/blog/${slug}`),
  };
}

export default function PostPage({
  params,
}: Readonly<{ params: Promise<{ locale: string; slug: string }> }>) {
  const { locale, slug } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("blog");
  const activeLocale = useLocale() as Locale;

  const post = postBySlug(activeLocale, slug);
  if (!post) notFound();

  const related = relatedFor(activeLocale, "post", slug);

  return (
    <main id="main" className="flex-1">
      <Section>
        <div className="mx-auto max-w-3xl">
          <Link href="/blog" variant="muted" className="text-sm">
            ← {t("all")}
          </Link>
          <Heading as="h1" variant="title" className="mt-6">
            {post.title}
          </Heading>
          <Text variant="caption" className="mt-4">
            {formatDate(activeLocale, post.date)} ·{" "}
            {t("readingTime", { minutes: post.readingMinutes })}
          </Text>
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}

          <Separator className="my-10" />

          <article className="prose">
            <MDXContent code={post.body} />
          </article>

          {related.length > 0 && (
            <>
              <Separator className="my-10" />
              <RelatedContent items={related} />
            </>
          )}
        </div>
      </Section>
    </main>
  );
}
