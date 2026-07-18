import { describe, expect, it } from "vitest";
import { type RagChunk, rankRelated, spinesFrom } from "./related";

/* Hand-picked 2D unit vectors — angles make the expected ranking obvious. */
const vec = (deg: number): number[] => {
  const rad = (deg * Math.PI) / 180;
  return [Math.cos(rad), Math.sin(rad)];
};

const chunk = (id: string, locale: string, v: number[]): RagChunk => {
  const [kind, , slug] = id.split(":");
  return {
    id,
    locale,
    url: `/${kind === "post" ? "blog" : "projects"}/${slug}`,
    title: slug ?? id,
    vec: v,
  };
};

const chunks: RagChunk[] = [
  chunk("project:en:alpha:facts", "en", vec(0)),
  chunk("project:en:alpha:body-0", "en", vec(90)), // body chunk — not a spine
  chunk("project:en:beta:facts", "en", vec(10)),
  chunk("post:en:gamma:summary", "en", vec(40)),
  chunk("post:en:delta:summary", "en", vec(80)),
  chunk("project:ko:alpha:facts", "ko", vec(5)), // other locale — excluded
  chunk("career:en:acme", "en", vec(1)), // no detail page — not a spine
  chunk("now:en", "en", vec(2)),
];

describe("spinesFrom", () => {
  it("keeps only one spine chunk per project/post document", () => {
    const ids = spinesFrom(chunks).map(
      (s) => `${s.kind}:${s.locale}:${s.slug}`,
    );
    expect(ids).toEqual([
      "project:en:alpha",
      "project:en:beta",
      "post:en:gamma",
      "post:en:delta",
      "project:ko:alpha",
    ]);
  });
});

describe("rankRelated", () => {
  const spines = spinesFrom(chunks);

  it("ranks same-locale documents by cosine similarity, excluding self", () => {
    const related = rankRelated(spines, "en", "project", "alpha");
    expect(related.map((r) => r.slug)).toEqual(["beta", "gamma", "delta"]);
    expect(related.map((r) => r.kind)).toEqual(["project", "post", "post"]);
    expect(related[0]?.score).toBeCloseTo(Math.cos((10 * Math.PI) / 180), 4);
    expect(related.every((r) => r.slug !== "alpha")).toBe(true);
  });

  it("respects the limit", () => {
    expect(rankRelated(spines, "en", "project", "alpha", 2)).toHaveLength(2);
  });

  it("returns nothing for an unknown document", () => {
    expect(rankRelated(spines, "en", "project", "nope")).toEqual([]);
  });

  it("stays within the requested locale", () => {
    const related = rankRelated(spines, "ko", "project", "alpha");
    expect(related).toEqual([]);
  });
});
