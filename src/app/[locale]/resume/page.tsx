import { now } from "content-collections";
import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Separator } from "@/components/ui/separator";
import { Tag } from "@/components/ui/tag";
import { Text } from "@/components/ui/text";
import {
  activitiesOfKind,
  activityKinds,
  careersByRecency,
} from "@/features/about/lib/data";
import { PrintButton } from "@/features/resume/components/print-button";
import type { Locale } from "@/i18n/routing";
import { formatDate, formatRange, formatYearMonth } from "@/lib/dates";
import { localeAlternates } from "@/lib/seo";
import { site } from "@/lib/site";

/*
 * The résumé is a *view* of content/data — the same entries that render
 * About. PDF is delivered via the print token theme (tokens.css) and the
 * browser's print-to-PDF, not a PDF library: zero dependencies, always in
 * sync, and the print theme itself is a design-system showcase.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resume" });
  return {
    title: t("title"),
    alternates: localeAlternates(locale as Locale, "/resume"),
  };
}

const contact = [
  { label: "devyeony@gmail.com", href: site.social.email },
  { label: "github.com/devyeony", href: site.social.github },
  { label: "linkedin.com/in/yeonhee-hayden-kim", href: site.social.linkedin },
  { label: "yuni.vercel.app", href: site.url },
];

export default function ResumePage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("resume");
  const tMeta = useTranslations("meta");
  const tAbout = useTranslations("about");
  const activeLocale = useLocale() as Locale;

  const careers = careersByRecency();
  const skills = [...new Set(careers.flatMap((career) => career.stack))];

  return (
    <main id="main" className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-6 py-14 md:px-10">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <Heading as="h1" variant="title">
              {site.author}
            </Heading>
            <Text variant="muted" className="mt-3 max-w-xl">
              {tMeta("description")}
            </Text>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
              {contact.map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} variant="muted" className="text-sm">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <PrintButton />
        </header>

        <Separator className="my-10" />

        <section aria-labelledby="resume-experience">
          <Heading
            as="h2"
            variant="subtitle"
            id="resume-experience"
            className="font-mono text-xs tracking-wider text-accent uppercase"
          >
            {t("experience")}
          </Heading>
          <ol className="mt-6 flex flex-col gap-8">
            {careers.map((career) => (
              <li key={career._meta.path}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <p className="font-medium text-text">
                    {career.role[activeLocale]}
                    <span className="text-text-muted">
                      {" "}
                      · {career.company[activeLocale]}
                    </span>
                  </p>
                  <Text as="span" variant="caption">
                    {formatRange(
                      activeLocale,
                      career.period.start,
                      career.period.end,
                      t("present"),
                    )}
                  </Text>
                </div>
                <Text variant="muted" className="mt-2">
                  {career.summary[activeLocale]}
                </Text>
                <Text variant="caption" className="mt-2 font-mono">
                  {career.stack.join(" · ")}
                </Text>
              </li>
            ))}
          </ol>
        </section>

        <Separator className="my-10" />

        <section aria-labelledby="resume-activities">
          <Heading
            as="h2"
            variant="subtitle"
            id="resume-activities"
            className="font-mono text-xs tracking-wider text-accent uppercase"
          >
            {t("activities")}
          </Heading>
          <div className="mt-6 flex flex-col gap-8">
            {activityKinds.map((kind) => {
              const entries = activitiesOfKind(kind);
              if (entries.length === 0) return null;
              return (
                <div key={kind}>
                  <h3 className="text-sm font-medium text-text">
                    {tAbout(`kind.${kind}`)}
                  </h3>
                  <ul className="mt-2 flex flex-col gap-2">
                    {entries.map((activity) => (
                      <li
                        key={activity._meta.path}
                        className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5"
                      >
                        <Text as="span" variant="muted" className="text-sm">
                          {activity.title[activeLocale]}
                          {activity.org
                            ? ` — ${activity.org[activeLocale]}`
                            : ""}
                          {activity.note
                            ? ` (${activity.note[activeLocale]})`
                            : ""}
                        </Text>
                        <Text as="span" variant="caption">
                          {activity.endDate
                            ? `${formatYearMonth(activeLocale, activity.date)}–${formatYearMonth(activeLocale, activity.endDate)}`
                            : formatYearMonth(activeLocale, activity.date)}
                        </Text>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <Separator className="my-10" />

        <section aria-labelledby="resume-skills">
          <Heading
            as="h2"
            variant="subtitle"
            id="resume-skills"
            className="font-mono text-xs tracking-wider text-accent uppercase"
          >
            {t("skills")}
          </Heading>
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </div>
        </section>

        <Separator className="my-10" />

        <Text variant="caption">
          {t("updated", { date: formatDate(activeLocale, now.updated) })} ·{" "}
          {t("generatedNote")}
        </Text>
      </div>
    </main>
  );
}
