import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { Text } from "@/components/ui/text";
import { ActivityList } from "@/features/about/components/activity-list";
import { CareerTimeline } from "@/features/about/components/career-timeline";
import { RoleGrid } from "@/features/about/components/role-grid";
import { narrative } from "@/features/about/lib/profile";
import type { Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    alternates: localeAlternates(locale as Locale, "/about"),
  };
}

export default function AboutPage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("about");
  const activeLocale = useLocale() as Locale;

  return (
    <main id="main" className="flex-1">
      <Section>
        <Heading as="h1" variant="display">
          {t("title")}
        </Heading>
        <div className="mt-10 flex max-w-prose flex-col gap-6">
          {narrative.map((paragraph) => (
            <Text key={paragraph.en.slice(0, 24)}>
              {paragraph[activeLocale]}
            </Text>
          ))}
        </div>
      </Section>

      <Separator className="mx-auto max-w-6xl" />

      <Section>
        <Heading as="h2" variant="title">
          {t("rolesTitle")}
        </Heading>
        <Text variant="muted" className="mt-4 max-w-2xl">
          {t("rolesIntro")}
        </Text>
        <div className="mt-10">
          <RoleGrid />
        </div>
      </Section>

      <Separator className="mx-auto max-w-6xl" />

      <Section>
        <Heading as="h2" variant="title">
          {t("experienceTitle")}
        </Heading>
        <div className="mt-10">
          <CareerTimeline />
        </div>
      </Section>

      <Separator className="mx-auto max-w-6xl" />

      <Section>
        <Heading as="h2" variant="title">
          {t("activitiesTitle")}
        </Heading>
        <div className="mt-10">
          <ActivityList />
        </div>
      </Section>

      <Separator className="mx-auto max-w-6xl" />

      {/* Contextual CTA — conversion lives where the persuasion ends. */}
      <Section>
        <Heading as="h2" variant="title" className="max-w-xl">
          {t("ctaTitle")}
        </Heading>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link href={site.social.email} variant="accent">
            {t("ctaEmail")} →
          </Link>
          <Link href="/resume" variant="muted">
            {t("resumeLink")}
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
