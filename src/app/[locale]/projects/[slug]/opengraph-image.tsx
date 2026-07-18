import { getTranslations } from "next-intl/server";
import { ogContentType, ogImage, ogSize } from "@/features/og/lib/render";
import {
  projectBySlug,
  projectsForLocale,
} from "@/features/projects/lib/collection";
import type { Locale } from "@/i18n/routing";

export const alt = "Project case study — Yeonhee Kim";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams({
  params,
}: {
  params: { locale: string };
}) {
  return projectsForLocale(params.locale as Locale).map(({ slug }) => ({
    slug,
  }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = projectBySlug(locale as Locale, slug);
  if (!project) return new Response("Not found", { status: 404 });
  const t = await getTranslations({ locale, namespace: "projects" });
  return ogImage({ title: project.title, kind: t("title") });
}
