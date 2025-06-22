"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { allProjects } from "contentlayer/generated";
import { ProjectArticle } from "./article";

export default function ProjectsPage() {
  const currentLocale = useLocale();
  const t = useTranslations("Projects");

  const parseDate = (date?: string): Date => date ? new Date(date) : new Date(0);

  const sortProjects = (a: typeof allProjects[number], b: typeof allProjects[number]): number => {
    const weightA = a.weight ?? 0;
    const weightB = b.weight ?? 0;
    if (weightA !== weightB) return weightB - weightA;

    const endDateDiff = parseDate(b.endDate).getTime() - parseDate(a.endDate).getTime();
    if (endDateDiff !== 0) return endDateDiff;

    const startDateDiff = parseDate(b.startDate).getTime() - parseDate(a.startDate).getTime();
    if (startDateDiff !== 0) return startDateDiff;

    return b.title.localeCompare(a.title);
  };

  const sortedProjects = allProjects
    .filter((p) => p.locale === currentLocale && p.published)
    .sort(sortProjects);

  return (
    <div className="mt-10 p-6">
      <h1 className="text-4xl text-zinc-100 font-mono font-bold inline-flex items-center gap-2">
        {t("title")}
      </h1>
      <p className="max-w-3xl sm:max-w-4xl md:max-w-5xl mt-3 mb-10 text-base text-zinc-400 font-mono items-center gap-2">
        {t("description")}
      </p>
      <article className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-2 justify-items-center justify-center gap-y-10 gap-x-10 mt-10 mb-5">
        {sortedProjects.map((project) => (
          <ProjectArticle key={project.slug ?? project.title} project={project} />
        ))}
      </article>
    </div>
  );
}
