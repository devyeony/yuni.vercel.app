import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { ContactForm } from "@/features/contact/components/contact-form";
import type { Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    alternates: localeAlternates(locale as Locale, "/contact"),
  };
}

export default function ContactPage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("contact");

  return (
    <main id="main" className="flex-1">
      <Section>
        <Heading as="h1" variant="display">
          {t("title")}
        </Heading>
        <Text variant="muted" className="mt-6 max-w-prose">
          {t("intro")}
        </Text>
        <div className="mt-12">
          <ContactForm />
        </div>
      </Section>

      <Separator className="mx-auto max-w-6xl" />

      <Section>
        <Heading as="h2" variant="title">
          {t("elsewhereTitle")}
        </Heading>
        <Text variant="muted" className="mt-4 max-w-prose">
          {t("elsewhereBody")}
        </Text>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link href={site.social.email} variant="accent">
            {t("emailLink")} →
          </Link>
          <Link href={site.social.linkedin} variant="muted">
            LinkedIn
          </Link>
          <Link href={site.social.github} variant="muted">
            GitHub
          </Link>
        </div>
      </Section>
    </main>
  );
}
