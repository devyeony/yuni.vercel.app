import { getTranslations } from "next-intl/server";
import { ogContentType, ogImage, ogSize } from "@/features/og/lib/render";
import { routing } from "@/i18n/routing";

export const alt = "Projects — Yeonhee Kim";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, meta] = await Promise.all([
    getTranslations({ locale, namespace: "projects" }),
    getTranslations({ locale, namespace: "meta" }),
  ]);
  return ogImage({
    title: t("title"),
    kind: meta("title"),
    showAuthor: false,
  });
}
