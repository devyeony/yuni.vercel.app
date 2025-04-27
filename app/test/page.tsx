import React from "react";
import { allProjects } from "contentlayer/generated";
import { Article } from "./article";

const compareDates = (dateA?: string, dateB?: string): number => {
  const aDate = dateA ? new Date(dateA) : new Date(0);
  const bDate = dateB ? new Date(dateB) : new Date(0);
  return bDate.getTime() - aDate.getTime();
};

const sorted = allProjects
  .filter((p) => p.published)
  .sort((a, b) => {
    if (!a.endDate || !b.endDate) {
      return !a.endDate
        ? -1
        : !b.endDate
        ? 1
        : compareDates(a.startDate, b.startDate) ||
          b.title.localeCompare(a.title);
    }

    const endDateComparison = compareDates(a.endDate, b.endDate);
    if (endDateComparison !== 0) return endDateComparison;

    const startDateComparison = compareDates(a.startDate, b.startDate);
    return startDateComparison !== 0
      ? startDateComparison
      : b.title.localeCompare(a.title);
  });

export default async function ProjectsPage() {
  return (
    <div className="p-6">
      <h1 className="text-4xl text-zinc-100 font-mono font-bold inline-flex items-center gap-2">
        Projects
      </h1>
      <p className="max-w-3xl sm:max-w-4xl md:max-w-5xl mt-3 mb-14 text-base text-zinc-400 font-mono items-center gap-2">
        Explore my projects, where I've applied my skills to solve meaningful
        challenges.
      </p>
      <article className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-2 justify-items-center justify-center gap-y-10 gap-x-10 mt-10 mb-5">
        {sorted.map((project, index) => (
          <Article key={index} project={project} />
        ))}
      </article>
    </div>
  );
}
