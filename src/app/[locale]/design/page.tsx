import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { use } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConstellationCat } from "@/components/ui/constellation-cat";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Link } from "@/components/ui/link";
import { LocaleSwitcher } from "@/components/ui/locale-switcher";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import { Tag } from "@/components/ui/tag";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Locale } from "@/i18n/routing";
import { localeAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "design" });
  return {
    title: t("title"),
    alternates: localeAlternates(locale as Locale, "/design"),
  };
}

/*
 * The showcase is the one place allowed to render primitive tokens directly —
 * it documents them. Everything else in the app references semantic tokens.
 */
const primitiveSwatches = [
  { name: "void-950", className: "bg-void-950" },
  { name: "void-900", className: "bg-void-900" },
  { name: "void-800", className: "bg-void-800" },
  { name: "void-700", className: "bg-void-700" },
  { name: "void-600", className: "bg-void-600" },
  { name: "void-500", className: "bg-void-500" },
  { name: "starlight-50", className: "bg-starlight-50" },
  { name: "starlight-100", className: "bg-starlight-100" },
  { name: "starlight-200", className: "bg-starlight-200" },
  { name: "starlight-300", className: "bg-starlight-300" },
  { name: "starlight-400", className: "bg-starlight-400" },
  { name: "starlight-600", className: "bg-starlight-600" },
  { name: "nebula-200", className: "bg-nebula-200" },
  { name: "nebula-300", className: "bg-nebula-300" },
  { name: "nebula-400", className: "bg-nebula-400" },
  { name: "nebula-500", className: "bg-nebula-500" },
  { name: "nebula-600", className: "bg-nebula-600" },
  { name: "nebula-700", className: "bg-nebula-700" },
  { name: "flare-400", className: "bg-flare-400" },
  { name: "flare-600", className: "bg-flare-600" },
];

const semanticSwatches = [
  { name: "surface", className: "bg-surface" },
  { name: "surface-raised", className: "bg-surface-raised" },
  { name: "border", className: "bg-border" },
  { name: "border-muted", className: "bg-border-muted" },
  { name: "text", className: "bg-text" },
  { name: "text-muted", className: "bg-text-muted" },
  { name: "accent", className: "bg-accent" },
  { name: "accent-muted", className: "bg-accent-muted" },
  { name: "accent-contrast", className: "bg-accent-contrast" },
  { name: "danger", className: "bg-danger" },
];

const motionTokens = [
  { name: "--duration-fast", value: "150ms" },
  { name: "--duration-base", value: "250ms" },
  { name: "--duration-slow", value: "500ms" },
  { name: "--ease-out-soft", value: "cubic-bezier(0.22, 1, 0.36, 1)" },
  { name: "--ease-in-out-soft", value: "cubic-bezier(0.65, 0, 0.35, 1)" },
];

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={`h-14 rounded-sm border border-border-muted ${className}`}
      />
      <span className="font-mono text-xs text-text-muted">{name}</span>
    </div>
  );
}

function DemoBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-mono text-xs tracking-wider text-text-muted uppercase">
        {label}
      </h3>
      {children}
    </div>
  );
}

export default function DesignPage({
  params,
}: Readonly<{ params: Promise<{ locale: string }> }>) {
  const { locale } = use(params);
  setRequestLocale(locale);
  const t = useTranslations("design");

  return (
    <main id="main">
      <Section className="pb-0">
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-2xl">
            <Heading as="h1" variant="display">
              {t("title")}
            </Heading>
            <Text variant="lead" className="mt-6 text-text-muted">
              {t("intro")}
            </Text>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
        </div>
      </Section>

      {/* ---------- Color ---------- */}
      <Section>
        <Heading as="h2" variant="title">
          {t("colors.title")}
        </Heading>
        <div className="mt-10 flex flex-col gap-10">
          <DemoBlock label={t("colors.primitives")}>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
              {primitiveSwatches.map((swatch) => (
                <Swatch key={swatch.name} {...swatch} />
              ))}
            </div>
          </DemoBlock>
          <DemoBlock label={t("colors.semantic")}>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
              {semanticSwatches.map((swatch) => (
                <Swatch key={swatch.name} {...swatch} />
              ))}
            </div>
          </DemoBlock>
        </div>
      </Section>

      <Separator className="mx-auto max-w-6xl" />

      {/* ---------- Typography ---------- */}
      <Section>
        <Heading as="h2" variant="title">
          {t("typography.title")}
        </Heading>
        <div className="mt-10 flex flex-col gap-8">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-text-muted">
              display · Fraunces · fluid clamp()
            </span>
            <Heading as="p" variant="display">
              {t("typography.sample")}
            </Heading>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-text-muted">title</span>
            <Heading as="p" variant="title">
              {t("typography.sample")}
            </Heading>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-text-muted">subtitle</span>
            <Heading as="p" variant="subtitle">
              {t("typography.sample")}
            </Heading>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-text-muted">
              lead · Instrument Sans
            </span>
            <Text variant="lead">{t("typography.sample")}</Text>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-xs text-text-muted">
              mono · JetBrains Mono
            </span>
            <code className="font-mono text-sm text-text-muted">
              const cosmos = await cat.observe()
            </code>
          </div>
        </div>
      </Section>

      <Separator className="mx-auto max-w-6xl" />

      {/* ---------- Motif ---------- */}
      <Section>
        <Heading as="h2" variant="title">
          {t("motif.title")}
        </Heading>
        <Text variant="muted" className="mt-4 max-w-2xl">
          {t("motif.note")}
        </Text>
        <ConstellationCat className="mt-8 w-56 sm:w-72" />
      </Section>

      <Separator className="mx-auto max-w-6xl" />

      {/* ---------- Motion ---------- */}
      <Section>
        <Heading as="h2" variant="title">
          {t("motion.title")}
        </Heading>
        <Text variant="muted" className="mt-4 max-w-2xl">
          {t("motion.note")}
        </Text>
        <dl className="mt-8 flex flex-col gap-2">
          {motionTokens.map((token) => (
            <div key={token.name} className="flex flex-wrap gap-x-6 gap-y-1">
              <dt className="w-44 font-mono text-sm text-text">{token.name}</dt>
              <dd className="font-mono text-sm text-text-muted">
                {token.value}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <Separator className="mx-auto max-w-6xl" />

      {/* ---------- Components ---------- */}
      <Section>
        <Heading as="h2" variant="title">
          {t("components.title")}
        </Heading>
        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2">
          <DemoBlock label={t("components.buttons")}>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="solid">{t("demo.solid")}</Button>
              <Button variant="outline">{t("demo.outline")}</Button>
              <Button variant="ghost">{t("demo.ghost")}</Button>
              <Button variant="solid" disabled>
                {t("demo.disabled")}
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="outline" size="sm">
                {t("demo.small")}
              </Button>
              <Button variant="outline" size="md">
                {t("demo.medium")}
              </Button>
              <Button variant="outline" size="lg">
                {t("demo.large")}
              </Button>
            </div>
          </DemoBlock>

          <DemoBlock label={t("components.links")}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link href="/design">{t("demo.internalLink")}</Link>
              <Link href="/design" variant="accent">
                {t("demo.accentLink")}
              </Link>
              <Link href="/design" variant="muted">
                {t("demo.mutedLink")}
              </Link>
              <Link href="https://github.com/devyeony" variant="accent">
                {t("demo.externalLink")} ↗
              </Link>
            </div>
          </DemoBlock>

          <DemoBlock label={t("components.tags")}>
            <div className="flex flex-wrap items-center gap-2">
              <Tag>next.js</Tag>
              <Tag>typescript</Tag>
              <Tag variant="accent">tailwind v4</Tag>
              <Tag variant="accent">base ui</Tag>
            </div>
          </DemoBlock>

          <DemoBlock label={t("components.card")}>
            <Card>
              <Heading as="h4" variant="subtitle">
                {t("demo.cardTitle")}
              </Heading>
              <Text variant="muted" className="mt-2">
                {t("demo.cardBody")}
              </Text>
            </Card>
          </DemoBlock>

          <DemoBlock label={t("components.form")}>
            <form className="flex max-w-sm flex-col gap-6">
              <Field name="email">
                <FieldLabel>{t("demo.fieldLabel")}</FieldLabel>
                <Input type="email" placeholder={t("demo.fieldPlaceholder")} />
                <FieldDescription>
                  {t("demo.fieldDescription")}
                </FieldDescription>
              </Field>
              <Field name="message">
                <FieldLabel>{t("demo.messageLabel")}</FieldLabel>
                <Textarea placeholder={t("demo.messagePlaceholder")} />
              </Field>
              <Field name="callsign" invalid>
                <FieldLabel>{t("demo.errorLabel")}</FieldLabel>
                <Input defaultValue={t("demo.errorValue")} />
                <FieldError match>{t("demo.errorMessage")}</FieldError>
              </Field>
            </form>
          </DemoBlock>

          <div className="flex flex-col gap-12">
            <DemoBlock label={t("components.dialog")}>
              <div>
                <Dialog>
                  <DialogTrigger
                    render={
                      <Button variant="outline">{t("demo.openDialog")}</Button>
                    }
                  />
                  <DialogContent>
                    <DialogTitle>{t("demo.dialogTitle")}</DialogTitle>
                    <DialogDescription>
                      {t("demo.dialogBody")}
                    </DialogDescription>
                    <div className="mt-6 flex justify-end">
                      <DialogClose
                        render={
                          <Button variant="ghost">{t("demo.close")}</Button>
                        }
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </DemoBlock>

            <DemoBlock label={t("components.tooltip")}>
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button variant="ghost">
                          {t("demo.tooltipTrigger")}
                        </Button>
                      }
                    />
                    <TooltipContent>{t("demo.tooltipContent")}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </DemoBlock>

            <DemoBlock label={t("components.controls")}>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Separator orientation="vertical" className="h-6 self-center" />
                <LocaleSwitcher />
              </div>
            </DemoBlock>
          </div>
        </div>
      </Section>
    </main>
  );
}
