import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";
import { Text } from "@/components/ui/text";
import { EmbeddingMap } from "@/features/embeddings/components/embedding-map";
import { mapPointsFor } from "@/features/embeddings/lib/map";
import type { Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "embeddings" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: localeAlternates(locale as Locale, "/embeddings"),
  };
}

export default function EmbeddingsPage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("embeddings");
  const activeLocale = useLocale() as Locale;

  const points = mapPointsFor(activeLocale);

  return (
    <main id="main" className="flex-1">
      <Section>
        <Heading as="h1" variant="display">
          {t("title")}
        </Heading>
        <Text variant="lead" className="mt-4 max-w-2xl">
          {t("intro")}
        </Text>
        <Text variant="caption" className="mt-4 max-w-2xl">
          {t("method")}
        </Text>
      </Section>

      <Section className="pt-0">
        <EmbeddingMap points={points} />
      </Section>
    </main>
  );
}
