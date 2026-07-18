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
import {
  projectBySlug,
  projectsForLocale,
  roleOrder,
} from "@/features/projects/lib/collection";
import { RelatedContent } from "@/features/related/components/related-content";
import { relatedFor } from "@/features/related/lib/related";
import type { Locale } from "@/i18n/routing";
import { formatRange } from "@/lib/dates";
import { localeAlternates } from "@/lib/seo";

export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  return projectsForLocale(params.locale as Locale).map(({ slug }) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projectBySlug(locale as Locale, slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: localeAlternates(locale as Locale, `/projects/${slug}`),
  };
}

const linkKeys = ["site", "demo", "repo"] as const;

export default function ProjectPage({
  params,
}: Readonly<{ params: Promise<{ locale: string; slug: string }> }>) {
  const { locale, slug } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("projects");
  const activeLocale = useLocale() as Locale;

  const project = projectBySlug(activeLocale, slug);
  if (!project) notFound();

  const roles = roleOrder
    .map((role) => ({ role, contribution: project.roles[role] }))
    .filter((entry) => entry.contribution);

  const related = relatedFor(activeLocale, "project", slug);

  return (
    <main id="main" className="flex-1">
      <Section>
        <Link href="/projects" variant="muted" className="text-sm">
          ← {t("all")}
        </Link>
        <Heading as="h1" variant="display" className="mt-6">
          {project.title}
        </Heading>
        <Text variant="lead" className="mt-4 max-w-2xl">
          {project.summary}
        </Text>
        <Text variant="caption" className="mt-4">
          {formatRange(
            activeLocale,
            project.period.start,
            project.period.end,
            t("present"),
          )}
        </Text>
      </Section>

      <Separator className="mx-auto max-w-6xl" />

      <Section>
        {/* Desktop recomposes into meta rail + content column; below lg the
            rail stacks on top as a compact header block. */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          <aside className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
            <div>
              <Heading as="h2" variant="subtitle" className="text-sm">
                {t("myRole")}
              </Heading>
              <dl className="mt-3 flex flex-col gap-3">
                {roles.map(({ role, contribution }) => (
                  <div key={role}>
                    <dt className="font-mono text-xs tracking-wider text-accent uppercase">
                      {t(`role.${role}`)}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-text-muted">
                      {contribution}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <Heading as="h2" variant="subtitle" className="text-sm">
                {t("stack")}
              </Heading>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </div>
            {project.links && (
              <div>
                <Heading as="h2" variant="subtitle" className="text-sm">
                  {t("links")}
                </Heading>
                <ul className="mt-3 flex flex-col gap-2">
                  {linkKeys.map((key) => {
                    const href = project.links?.[key];
                    if (!href) return null;
                    return (
                      <li key={key}>
                        <Link href={href} variant="muted" className="text-sm">
                          {t(`link.${key}`)} ↗
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </aside>

          <div className="max-w-prose">
            <section aria-labelledby="problem">
              <Heading as="h2" variant="title" id="problem">
                {t("problem")}
              </Heading>
              <Text variant="muted" className="mt-4">
                {project.problem}
              </Text>
            </section>

            <section aria-labelledby="decisions" className="mt-14">
              <Heading as="h2" variant="title" id="decisions">
                {t("decisions")}
              </Heading>
              <dl className="mt-6 flex flex-col gap-8">
                {project.decisions.map(({ decision, tradeoff }) => (
                  <div
                    key={decision}
                    className="border-l-2 border-accent/40 pl-5"
                  >
                    <dt className="font-medium text-text">{decision}</dt>
                    <dd className="mt-2 leading-relaxed text-text-muted">
                      {tradeoff}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="outcomes" className="mt-14">
              <Heading as="h2" variant="title" id="outcomes">
                {t("outcomes")}
              </Heading>
              <ul className="mt-6 flex flex-col gap-3">
                {project.outcomes.map((outcome) => (
                  <li
                    key={outcome}
                    className="flex gap-3 leading-relaxed text-text"
                  >
                    <span aria-hidden className="mt-px select-none text-accent">
                      ✦
                    </span>
                    {outcome}
                  </li>
                ))}
              </ul>
            </section>

            <Separator className="my-14" />

            <article className="prose">
              <MDXContent code={project.body} />
            </article>
          </div>
        </div>
      </Section>

      {related.length > 0 && (
        <>
          <Separator className="mx-auto max-w-6xl" />
          <Section>
            <RelatedContent items={related} />
          </Section>
        </>
      )}

      <Separator className="mx-auto max-w-6xl" />

      {/* Contextual CTA — conversion lives where the persuasion ends. */}
      <Section>
        <Heading as="h2" variant="title" className="max-w-xl">
          {t("ctaTitle")}
        </Heading>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
          <Link href="/contact" variant="accent">
            {t("ctaContact")} →
          </Link>
          <Link href="/projects" variant="muted">
            {t("all")}
          </Link>
        </div>
      </Section>
    </main>
  );
}
