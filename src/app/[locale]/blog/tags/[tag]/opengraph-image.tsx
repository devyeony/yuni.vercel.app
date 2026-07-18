import { getTranslations } from "next-intl/server";
import { tagsForLocale } from "@/features/blog/lib/collection";
import { ogContentType, ogImage, ogSize } from "@/features/og/lib/render";
import type { Locale } from "@/i18n/routing";

export const alt = "Blog tag — Yeonhee Kim";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  return tagsForLocale(params.locale as Locale).map((tag) => ({ tag }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; tag: string }>;
}) {
  const { locale, tag } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return ogImage({
    title: `#${decodeURIComponent(tag)}`,
    kind: t("title"),
  });
}
