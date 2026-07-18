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
