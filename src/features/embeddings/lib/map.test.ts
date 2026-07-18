import { describe, expect, it } from "vitest";
import type { RagChunk } from "@/lib/rag-index";
import { buildMapPoints } from "./map";

const vec = (deg: number): number[] => {
  const rad = (deg * Math.PI) / 180;
  return [Math.cos(rad), Math.sin(rad)];
};

const chunk = (id: string, locale: string, v: number[]): RagChunk => ({
  id,
  locale,
  url: `/x/${id}`,
  title: id,
  vec: v,
});

const chunks: RagChunk[] = [
  chunk("project:en:alpha:facts", "en", vec(0)),
  chunk("project:en:alpha:body-0", "en", vec(2)), // body chunk — not a point
  chunk("post:en:beta:summary", "en", vec(10)),
  chunk("career:en:acme", "en", vec(50)),
  chunk("activity:en:meetup", "en", vec(90)),
  chunk("now:en", "en", vec(130)),
  chunk("project:ko:alpha:facts", "ko", vec(5)), // other locale — excluded
];

describe("buildMapPoints", () => {
  const points = buildMapPoints(chunks, "en");

  it("keeps one point per content entry, ordered by kind", () => {
    expect(points.map((p) => p.id)).toEqual([
      "project:en:alpha:facts",
      "post:en:beta:summary",
      "career:en:acme",
      "activity:en:meetup",
      "now:en",
    ]);
    expect(points.map((p) => p.kind)).toEqual([
      "project",
      "post",
      "career",
      "activity",
      "now",
    ]);
  });

  it("normalizes coordinates into [0, 1]", () => {
    for (const { x, y } of points) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(1);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(1);
    }
  });

  it("ranks neighbors by cosine in the original space, excluding self", () => {
    const project = points[0];
    if (!project) throw new Error("missing point");
    expect(project.neighbors).toHaveLength(3);
    const titles = project.neighbors.map(({ index }) => points[index]?.id);
    expect(titles).toEqual([
      "post:en:beta:summary",
      "career:en:acme",
      "activity:en:meetup",
    ]);
    const scores = project.neighbors.map(({ score }) => score);
    expect(scores[0]).toBeCloseTo(Math.cos((10 * Math.PI) / 180), 4);
    expect([...scores].sort((a, b) => b - a)).toEqual(scores);
  });

  it("keeps close content close on the plane", () => {
    const [project, post, , , now] = points;
    if (!project || !post || !now) throw new Error("missing point");
    const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      Math.hypot(a.x - b.x, a.y - b.y);
    expect(dist(project, post)).toBeLessThan(dist(project, now));
  });
});
