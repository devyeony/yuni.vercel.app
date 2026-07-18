import { readFileSync } from "node:fs";
import path from "node:path";

/*
 * Typed access to the build-time RAG index (scripts/build-rag-index.mjs).
 * The index is a build artifact generated before `next build`, so it is
 * read from disk lazily instead of imported — `tsc` must pass on a clean
 * checkout where public/rag-index.json does not exist yet. Consumers run
 * only during static generation; nothing here reaches the client bundle.
 */

export type RagChunk = {
  id: string;
  locale: string;
  url: string;
  title: string;
  vec: number[];
};

/** Vectors are L2-normalized at index build time, so dot product = cosine. */
export const cosine = (a: number[], b: number[]) =>
  a.reduce((sum, v, i) => sum + v * (b[i] ?? 0), 0);

let cached: RagChunk[] | undefined;

export function ragChunks(): RagChunk[] {
  if (!cached) {
    const raw = readFileSync(
      path.join(process.cwd(), "public", "rag-index.json"),
      "utf8",
    );
    cached = (JSON.parse(raw) as { chunks: RagChunk[] }).chunks;
  }
  return cached;
}
