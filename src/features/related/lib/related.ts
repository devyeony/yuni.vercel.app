import type { Locale } from "@/i18n/routing";
import { cosine, type RagChunk, ragChunks } from "@/lib/rag-index";

/*
 * Similar-content recommendations (PLAN §7-1): rank documents by cosine
 * between their spine vectors from the build-time RAG index. Runs only
 * during static generation — every detail page ships pre-computed links,
 * zero runtime embedding work.
 */

export type RelatedKind = "project" | "post";

export type RelatedItem = {
  kind: RelatedKind;
  slug: string;
  url: string;
  title: string;
  score: number;
};

type Spine = {
  kind: RelatedKind;
  locale: string;
  slug: string;
  url: string;
  title: string;
  vec: number[];
};

/*
 * One spine chunk per document carries its condensed identity: the
 * `facts` chunk for projects (summary + problem/decisions/outcomes),
 * the `summary` chunk for posts. Body chunks and /about entries are
 * search-only — they have no detail page to recommend.
 */
const SPINE_ID = /^(project|post):([^:]+):(.+):(facts|summary)$/;

export function spinesFrom(chunks: RagChunk[]): Spine[] {
  return chunks.flatMap((chunk) => {
    const [, kind, locale, slug] = SPINE_ID.exec(chunk.id) ?? [];
    if (!kind || !locale || !slug) return [];
    return [
      {
        kind: kind as RelatedKind,
        locale,
        slug,
        url: chunk.url,
        title: chunk.title,
        vec: chunk.vec,
      },
    ];
  });
}

export function rankRelated(
  spines: Spine[],
  locale: Locale,
  kind: RelatedKind,
  slug: string,
  limit = 3,
): RelatedItem[] {
  const self = spines.find(
    (s) => s.locale === locale && s.kind === kind && s.slug === slug,
  );
  if (!self) return [];
  return spines
    .filter((s) => s.locale === locale && s !== self)
    .map((s) => ({
      kind: s.kind,
      slug: s.slug,
      url: s.url,
      title: s.title,
      score: cosine(self.vec, s.vec),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function relatedFor(
  locale: Locale,
  kind: RelatedKind,
  slug: string,
): RelatedItem[] {
  return rankRelated(spinesFrom(ragChunks()), locale, kind, slug);
}
