import { getTranslations } from "next-intl/server";
import { postBySlug, postsForLocale } from "@/features/blog/lib/collection";
import { ogContentType, ogImage, ogSize } from "@/features/og/lib/render";
import type { Locale } from "@/i18n/routing";

export const alt = "Blog post — Yeonhee Kim";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  return postsForLocale(params.locale as Locale).map(({ slug }) => ({ slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = postBySlug(locale as Locale, slug);
  if (!post) return new Response("Not found", { status: 404 });
  const t = await getTranslations({ locale, namespace: "blog" });
  return ogImage({ title: post.title, kind: t("title") });
}
