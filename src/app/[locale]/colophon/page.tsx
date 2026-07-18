import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { Tag } from "@/components/ui/tag";
import { Text } from "@/components/ui/text";
import { CopyButton } from "@/features/colophon/components/copy-button";
import {
  mcp,
  principles,
  restraints,
  stack,
  surfaces,
  typefaces,
} from "@/features/colophon/lib/colophon";
import type { Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";
import { site } from "@/lib/site";

/*
 * The colophon narrates the process behind the site — the agent harness
 * (ADR-0001), the single-source content pipeline, and the MCP server —
 * because the process is as much the portfolio as the pages are.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "colophon" });
  return {
    title: t("title"),
    alternates: localeAlternates(locale as Locale, "/colophon"),
  };
}

export default function ColophonPage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("colophon");
  const activeLocale = useLocale() as Locale;

  return (
    <main id="main" className="flex-1">
      <Section>
        <Heading as="h1" variant="display">
          {t("title")}
        </Heading>
        <Text variant="muted" className="mt-6 max-w-prose">
          {t("intro")}
        </Text>
      </Section>

      <Separator className="mx-auto max-w-6xl" />

      <Section>
        <Heading as="h2" variant="title">
          {t("harnessTitle")}
        </Heading>
        <Text variant="muted" className="mt-4 max-w-prose">
          {t("harnessIntro")}
        </Text>
        <div className="mt-10 flex max-w-3xl flex-col">
          {principles.map((principle) => (
            <div
              key={principle.key}
              className="border-t border-border-muted py-8"
            >
              <Heading as="h3" variant="subtitle">
                {principle.title[activeLocale]}
              </Heading>
              <Text variant="muted" className="mt-2 max-w-prose">
                {principle.body[activeLocale]}
              </Text>
            </div>
          ))}
        </div>
      </Section>

      <Separator className="mx-auto max-w-6xl" />

      <Section>
        <Heading as="h2" variant="title">
          {t("pipelineTitle")}
        </Heading>
        <Text variant="muted" className="mt-4 max-w-prose">
          {t("pipelineIntro")}
        </Text>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {surfaces.map((surface) => (
            <Card key={surface.key}>
              <Heading as="h3" variant="subtitle">
                {surface.name[activeLocale]}
              </Heading>
              <Text variant="muted" className="mt-2">
                {surface.detail[activeLocale]}
              </Text>
            </Card>
          ))}
        </div>
      </Section>

      <Separator className="mx-auto max-w-6xl" />

      <Section>
        <Heading as="h2" variant="title">
          {t("mcpTitle")}
        </Heading>
        <Text variant="muted" className="mt-4 max-w-prose">
          {t("mcpIntro")}
        </Text>

        <Card className="mt-10 max-w-3xl p-0">
          <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="min-w-0">
              <Text
                variant="caption"
                as="p"
                className="font-mono tracking-wider uppercase"
              >
                Claude Code
              </Text>
              {/* Wraps instead of scrolling: a sideways-scrollable region
                  would need keyboard access (axe) that a code block lacks. */}
              <code className="mt-2 block font-mono text-sm wrap-anywhere">
                {mcp.addCommand}
              </code>
            </div>
            <CopyButton
              value={mcp.addCommand}
              label={t("copy")}
              copiedLabel={t("copied")}
            />
          </div>
          <Separator />
          <div className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
            <div className="min-w-0">
              <Text
                variant="caption"
                as="p"
                className="font-mono tracking-wider uppercase"
              >
                {t("mcpClientLabel")}
              </Text>
              <code className="mt-2 block font-mono text-sm wrap-anywhere">
                {mcp.endpoint}
              </code>
            </div>
            <CopyButton
              value={mcp.endpoint}
              label={t("copy")}
              copiedLabel={t("copied")}
            />
          </div>
        </Card>

        <div className="mt-6 max-w-3xl">
          <Text
            variant="caption"
            as="p"
            className="font-mono tracking-wider uppercase"
          >
            {t("mcpToolsLabel")}
          </Text>
          <ul className="mt-3 flex flex-wrap gap-2">
            {mcp.tools.map((tool) => (
              <li key={tool}>
                <Tag className="normal-case">{tool}</Tag>
              </li>
            ))}
          </ul>
        </div>

        <figure className="mt-12 max-w-3xl">
          <picture>
            <source
              media="(prefers-reduced-motion: reduce)"
              srcSet="/colophon/mcp-demo-still.png"
            />
            {/* Animated GIF with a reduced-motion still — a fit next/image
                can't express, hence the plain img. */}
            <img
              src="/colophon/mcp-demo.gif"
              alt={t("demoAlt")}
              width={918}
              height={651}
              loading="lazy"
              className="h-auto w-full rounded-md border border-border-muted"
            />
          </picture>
          <figcaption className="mt-3">
            <Text variant="caption" as="span">
              {t("demoCaption")}
            </Text>
          </figcaption>
        </figure>
      </Section>

      <Separator className="mx-auto max-w-6xl" />

      <Section>
        <Heading as="h2" variant="title">
          {t("restraintTitle")}
        </Heading>
        <Text variant="muted" className="mt-4 max-w-prose">
          {t("restraintIntro")}
        </Text>
        <div className="mt-10 flex max-w-3xl flex-col">
          {restraints.map((restraint) => (
            <div
              key={restraint.key}
              className="flex flex-col gap-2 border-t border-border-muted py-6 md:flex-row md:gap-10"
            >
              <Heading
                as="h3"
                variant="subtitle"
                className="md:w-64 md:shrink-0"
              >
                {restraint.thing[activeLocale]}
              </Heading>
              <Text variant="muted" className="max-w-prose">
                {restraint.reason[activeLocale]}
              </Text>
            </div>
          ))}
        </div>
        <Link
          href={`${site.repo}/tree/main/docs/adr`}
          variant="accent"
          className="mt-8 inline-block"
        >
          {t("adrCta")} →
        </Link>
      </Section>

      <Separator className="mx-auto max-w-6xl" />

      <Section>
        <Heading as="h2" variant="title">
          {t("stackTitle")}
        </Heading>
        <div className="mt-10 flex max-w-3xl flex-col">
          {stack.map((item) => (
            <div
              key={item.name}
              className="flex flex-col gap-1 border-t border-border-muted py-4 md:flex-row md:gap-10"
            >
              <Text as="span" className="font-mono text-sm md:w-64 md:shrink-0">
                {item.name}
              </Text>
              <Text variant="muted" className="max-w-prose">
                {item.note[activeLocale]}
              </Text>
            </div>
          ))}
        </div>

        <Heading as="h3" variant="subtitle" className="mt-14">
          {t("typeTitle")}
        </Heading>
        <div className="mt-6 flex max-w-3xl flex-col">
          {typefaces.map((typeface) => (
            <div
              key={typeface.name}
              className="flex flex-col gap-1 border-t border-border-muted py-4 md:flex-row md:gap-10"
            >
              <Text as="span" className="font-mono text-sm md:w-64 md:shrink-0">
                {typeface.name}
              </Text>
              <Text variant="muted" className="max-w-prose">
                {typeface.role[activeLocale]}
              </Text>
            </div>
          ))}
        </div>

        <Text variant="muted" className="mt-14 max-w-prose">
          {t("sourceBody")}
        </Text>
        <Link href={site.repo} variant="accent" className="mt-4 inline-block">
          {t("sourceCta")} →
        </Link>
      </Section>
    </main>
  );
}
