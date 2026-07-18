import { allProjects, type Project } from "content-collections";
import type { Locale } from "@/i18n/routing";

export type { Project };

/* Depth-first, matching the About role order. */
export const roleOrder = ["backend", "frontend", "design", "planning"] as const;

export function projectsForLocale(locale: Locale): Project[] {
  return allProjects
    .filter((project) => project.locale === locale && !project.draft)
    .sort((a, b) => a.order - b.order);
}

export function projectBySlug(
  locale: Locale,
  slug: string,
): Project | undefined {
  return allProjects.find(
    (project) =>
      project.locale === locale && project.slug === slug && !project.draft,
  );
}

/** "2021-07" → "Jul 2021" (en) / "2021년 7월" (ko); open end renders `present`. */
export function formatPeriod(
  locale: Locale,
  period: Project["period"],
  present: string,
): string {
  const format = (yearMonth: string) =>
    new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      timeZone: "UTC",
    }).format(new Date(`${yearMonth}-01T00:00:00Z`));
  return `${format(period.start)} – ${period.end ? format(period.end) : present}`;
}
