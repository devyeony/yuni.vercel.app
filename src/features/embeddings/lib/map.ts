import type { Locale } from "@/i18n/routing";
import { cosine, type RagChunk, ragChunks } from "@/lib/rag-index";
import { projectTo2d } from "./pca";

/*
 * Embedding map data (PLAN §7-1): one point per piece of content — the
 * spine chunk of each project/post plus every career, activity, and Now
 * entry — projected to 2D with PCA at static-generation time. Neighbors
 * are ranked in the original 384-dim space, not the 2D projection, so the
 * panel shows true semantic distance while the plot shows the layout.
 */

const mapKinds = ["project", "post", "career", "activity", "now"] as const;

export type MapKind = (typeof mapKinds)[number];

type MapNeighbor = { index: number; score: number };

export type MapPoint = {
  id: string;
  kind: MapKind;
  title: string;
  url: string;
  /** Normalized plot coordinates in [0, 1]. */
  x: number;
  y: number;
  /** Top neighbors by cosine, as indices into the same points array. */
  neighbors: MapNeighbor[];
};

const NEIGHBORS = 3;

/** One chunk per content entry: document spines + every /about entry. */
const POINT_ID =
  /^(?:(project|post):[^:]+:.+:(?:facts|summary)|(career|activity):.+|(now):.+)$/;

const kindOf = (id: string): MapKind | undefined => {
  const match = POINT_ID.exec(id);
  if (!match) return undefined;
  return (match[1] ?? match[2] ?? match[3]) as MapKind;
};

const normalizeAxis = (values: number[]) => {
  const min = Math.min(...values);
  const range = Math.max(...values) - min;
  return values.map((v) => (range > 0 ? (v - min) / range : 0.5));
};

export function buildMapPoints(chunks: RagChunk[], locale: Locale): MapPoint[] {
  const pool = chunks.flatMap((chunk) => {
    const kind = chunk.locale === locale ? kindOf(chunk.id) : undefined;
    return kind ? [{ chunk, kind }] : [];
  });
  const sorted = [...pool].sort(
    (a, b) => mapKinds.indexOf(a.kind) - mapKinds.indexOf(b.kind),
  );

  const coords = projectTo2d(sorted.map(({ chunk }) => chunk.vec));
  const xs = normalizeAxis(coords.map(([x]) => x));
  const ys = normalizeAxis(coords.map(([, y]) => y));

  return sorted.map(({ chunk, kind }, i) => ({
    id: chunk.id,
    kind,
    title: chunk.title,
    url: chunk.url,
    x: xs[i] ?? 0.5,
    y: ys[i] ?? 0.5,
    neighbors: sorted
      .map((other, index) => ({
        index,
        score: cosine(chunk.vec, other.chunk.vec),
      }))
      .filter(({ index }) => index !== i)
      .sort((a, b) => b.score - a.score)
      .slice(0, NEIGHBORS),
  }));
}

export function mapPointsFor(locale: Locale): MapPoint[] {
  return buildMapPoints(ragChunks(), locale);
}
