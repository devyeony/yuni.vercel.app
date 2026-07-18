import { countMatches, snippetAround, tokenize } from "@/lib/lexical";

/*
 * Static hybrid site search (§7-3, method finalized 2026-07-18): lexical
 * matching finds foothold chunks in the 125 kB build-time index, then their
 * 384-dim vectors expand the result set through embedding space — documents
 * with zero lexical overlap surface as "nearby" with a visible cosine score.
 * No runtime model anywhere: the client-side WASM candidate was rejected on
 * measured size (113 MB model + 16 MB tokenizer download per visitor) and a
 * serverless embedder would break the build-time-static AI layer (ADR-0004).
 *
 * Self-contained on purpose — this runs in the browser, so it must not
 * import the node:fs-backed index loader in src/lib/rag-index.ts.
 */

export type SearchChunk = {
  id: string;
  locale: string;
  url: string;
  title: string;
  text: string;
  vec: number[];
};

type SearchKind = "project" | "post" | "career" | "activity" | "now";

type SearchMatch = {
  kind: SearchKind;
  url: string;
  title: string;
  score: number;
  snippet: string;
};

type SearchNearby = {
  kind: SearchKind;
  url: string;
  title: string;
  similarity: number;
};

export type SearchResults = { matches: SearchMatch[]; nearby: SearchNearby[] };

const TITLE_WEIGHT = 4;
const MAX_MATCHES = 8;
const MAX_NEARBY = 3;
const SEED_COUNT = 5;
/* e5 cosines cluster high (~0.75 baseline); related content lands 0.82+. */
const NEARBY_MIN = 0.8;

/** Vectors are L2-normalized at index build time, so dot product = cosine. */
const dot = (a: number[], b: number[]) =>
  a.reduce((sum, v, i) => sum + v * (b[i] ?? 0), 0);

/*
 * One result per document, not per chunk: project/post ids are
 * "<kind>:<locale>:<slug>:<chunk>", so their doc key drops the chunk
 * segment; career/activity/now chunks are one-per-entry already.
 */
const docKey = (chunk: SearchChunk): string => {
  const [kind] = chunk.id.split(":");
  return kind === "project" || kind === "post"
    ? chunk.id.split(":").slice(0, 3).join(":")
    : chunk.id;
};

const kindOf = (chunk: SearchChunk): SearchKind =>
  chunk.id.split(":")[0] as SearchKind;

export function search(
  chunks: readonly SearchChunk[],
  locale: string,
  query: string,
): SearchResults {
  const terms = [...new Set(tokenize(query))];
  if (terms.length === 0) return { matches: [], nearby: [] };

  const scored = chunks
    .filter((chunk) => chunk.locale === locale)
    .map((chunk) => {
      const lexical = terms.reduce(
        (sum, term) =>
          sum +
          countMatches(tokenize(chunk.title), term) * TITLE_WEIGHT +
          countMatches(tokenize(chunk.text), term),
        0,
      );
      return { chunk, lexical };
    });

  const seeds = scored
    .filter((entry) => entry.lexical > 0)
    .sort((a, b) => b.lexical - a.lexical)
    .slice(0, SEED_COUNT);
  if (seeds.length === 0) return { matches: [], nearby: [] };

  /* Pseudo query vector: lexically-weighted centroid of the seed chunks. */
  const dims = seeds[0]?.chunk.vec.length ?? 0;
  const centroid = new Array<number>(dims).fill(0);
  for (const { chunk, lexical } of seeds) {
    chunk.vec.forEach((v, i) => {
      centroid[i] = (centroid[i] ?? 0) + v * lexical;
    });
  }
  const norm = Math.sqrt(dot(centroid, centroid)) || 1;
  const unit = centroid.map((v) => v / norm);

  /* Collapse chunks to documents; a doc keeps its best chunk per signal. */
  const docs = new Map<
    string,
    { chunk: SearchChunk; lexical: number; similarity: number }
  >();
  for (const { chunk, lexical } of scored) {
    const key = docKey(chunk);
    const similarity = dot(unit, chunk.vec);
    const existing = docs.get(key);
    if (!existing) {
      docs.set(key, { chunk, lexical, similarity });
      continue;
    }
    existing.similarity = Math.max(existing.similarity, similarity);
    if (lexical > existing.lexical) {
      existing.lexical = lexical;
      existing.chunk = chunk;
    }
  }

  const entries = [...docs.values()];
  const matches = entries
    .filter((doc) => doc.lexical > 0)
    .sort((a, b) => b.lexical - a.lexical || b.similarity - a.similarity)
    .slice(0, MAX_MATCHES)
    .map((doc) => ({
      kind: kindOf(doc.chunk),
      url: doc.chunk.url,
      title: doc.chunk.title,
      score: doc.lexical,
      snippet: snippetAround(doc.chunk.text, terms),
    }));

  const nearby = entries
    .filter((doc) => doc.lexical === 0 && doc.similarity >= NEARBY_MIN)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, MAX_NEARBY)
    .map((doc) => ({
      kind: kindOf(doc.chunk),
      url: doc.chunk.url,
      title: doc.chunk.title,
      similarity: doc.similarity,
    }));

  return { matches, nearby };
}
