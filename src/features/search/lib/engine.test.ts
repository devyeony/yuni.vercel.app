import { describe, expect, it } from "vitest";
import { type SearchChunk, search } from "./engine";

/*
 * Hand-picked 2D unit vectors — angles make cosine relationships obvious.
 * (Real vectors are 384-dim; the engine only relies on normalization.)
 */
const vec = (deg: number): number[] => {
  const rad = (deg * Math.PI) / 180;
  return [Math.cos(rad), Math.sin(rad)];
};

const chunk = (
  id: string,
  title: string,
  text: string,
  v: number[],
  locale = "en",
): SearchChunk => {
  const [kind, , slug] = id.split(":");
  const url =
    kind === "project"
      ? `/projects/${slug}`
      : kind === "post"
        ? `/blog/${slug}`
        : "/about";
  return { id, locale, url, title, text, vec: v };
};

const chunks: SearchChunk[] = [
  chunk("project:en:alpha:facts", "Alpha", "A Spring backend service.", vec(0)),
  chunk("project:en:alpha:body-0", "Alpha", "More about the backend.", vec(5)),
  // Semantically beside alpha, shares no query words:
  chunk("career:en:acme", "Acme", "Insurance platform work.", vec(10)),
  // Far away in embedding space:
  chunk("post:en:gamma", "Gamma", "Choosing display typefaces.", vec(90)),
  // Same words, wrong locale:
  chunk(
    "project:ko:alpha:facts",
    "알파",
    "Spring 백엔드 서비스.",
    vec(0),
    "ko",
  ),
];

describe("search", () => {
  it("finds lexical matches and collapses chunks per document", () => {
    const { matches } = search(chunks, "en", "backend");
    expect(matches.map((m) => m.url)).toEqual(["/projects/alpha"]);
    expect(matches[0]?.kind).toBe("project");
    expect(matches[0]?.snippet).toContain("backend");
  });

  it("surfaces semantic neighbors that share no query words", () => {
    const { matches, nearby } = search(chunks, "en", "Spring");
    expect(matches.map((m) => m.url)).toEqual(["/projects/alpha"]);
    expect(nearby.map((n) => n.url)).toEqual(["/about"]);
    // cos(10° − ~2.5° centroid) ≈ 0.99, and gamma at 90° stays out.
    expect(nearby[0]?.similarity).toBeGreaterThan(0.9);
  });

  it("weights title hits above body hits", () => {
    const { matches } = search(
      [
        chunk("post:en:a", "Tokens", "Nothing relevant here.", vec(0)),
        chunk("post:en:b", "Other", "tokens tokens tokens.", vec(90)),
      ],
      "en",
      "tokens",
    );
    expect(matches.map((m) => m.title)).toEqual(["Tokens", "Other"]);
  });

  it("only searches the requested locale", () => {
    const { matches } = search(chunks, "ko", "Spring");
    expect(matches.map((m) => m.title)).toEqual(["알파"]);
  });

  it("matches Korean by eojeol prefix", () => {
    const { matches } = search(
      [chunk("post:ko:a", "글", "오픈소스에 기여했다.", vec(0), "ko")],
      "ko",
      "오픈소스",
    );
    expect(matches).toHaveLength(1);
  });

  it("returns nothing for empty or unmatched queries", () => {
    expect(search(chunks, "en", "  ")).toEqual({ matches: [], nearby: [] });
    expect(search(chunks, "en", "xyzzy")).toEqual({ matches: [], nearby: [] });
  });
});
