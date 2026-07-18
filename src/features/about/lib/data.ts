import {
  type Activity,
  allActivities,
  allCareers,
  type Career,
} from "content-collections";

export type { Activity, Career };

/** Display order: the positioning anchor (open source) leads. */
export const activityKinds = [
  "opensource",
  "talk",
  "publication",
  "community",
] as const;

export function careersByRecency(): Career[] {
  return [...allCareers].sort((a, b) =>
    b.period.start.localeCompare(a.period.start),
  );
}

export function activitiesOfKind(kind: Activity["kind"]): Activity[] {
  return allActivities
    .filter((activity) => activity.kind === kind)
    .sort((a, b) => b.date.localeCompare(a.date));
}
