import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Section } from "@/components/ui/section";
import { PostCard } from "@/features/blog/components/post-card";
import { postsForTag, tagsForLocale } from "@/features/blog/lib/collection";
import type { Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";

export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  return tagsForLocale(params.locale as Locale).map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}): Promise<Metadata> {
  const { locale, tag } = await params;
  const decoded = decodeURIComponent(tag);
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("taggedTitle", { tag: decoded }),
    alternates: localeAlternates(
      locale as Locale,
      `/blog/tags/${encodeURIComponent(decoded)}`,
    ),
  };
}

export default function TagPage({
  params,
}: Readonly<{ params: Promise<{ locale: string; tag: string }> }>) {
  const { locale, tag } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("blog");
  const activeLocale = useLocale() as Locale;
  const decoded = decodeURIComponent(tag);

  const posts = postsForTag(activeLocale, decoded);
  if (posts.length === 0) notFound();

  return (
    <main id="main" className="flex-1">
      <Section>
        <Link href="/blog" variant="muted" className="text-sm">
          ← {t("all")}
        </Link>
        <Heading as="h1" variant="display" className="mt-6">
          {t("taggedTitle", { tag: decoded })}
        </Heading>
        <div className="mt-14 flex max-w-3xl flex-col gap-12">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </Section>
    </main>
  );
}
