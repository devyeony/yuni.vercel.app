import { getTranslations } from "next-intl/server";
import { ogContentType, ogImage, ogSize } from "@/features/og/lib/render";
import { routing } from "@/i18n/routing";

export const alt = "Yeonhee Kim — Software Engineer";
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
  const [meta, home] = await Promise.all([
    getTranslations({ locale, namespace: "meta" }),
    getTranslations({ locale, namespace: "home" }),
  ]);
  return ogImage({
    title: meta("title"),
    kind: home("hero.tagline"),
    showAuthor: false,
  });
}
