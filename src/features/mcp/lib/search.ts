/*
 * Keyword scoring for the MCP `search_content` tool. Deliberately lexical,
 * not semantic: runtime query embedding would pull the model into the
 * serverless function, and the AI layer stays build-time static (§7-1).
 * Unicode-aware tokenization so Korean text matches by prefix within an
 * eojeol ("오픈소스" hits "오픈소스에").
 */

export type SearchDoc = {
  kind: "project" | "post" | "activity";
  title: string;
  text: string;
  url: string;
};

export type SearchHit = {
  kind: SearchDoc["kind"];
  title: string;
  url: string;
  score: number;
  snippet: string;
};

const TITLE_WEIGHT = 4;
const SNIPPET_RADIUS = 90;

const tokenize = (value: string): string[] =>
  value.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];

const matches = (tokens: string[], term: string): number =>
  tokens.reduce((n, token) => (token.startsWith(term) ? n + 1 : n), 0);

function snippetAround(text: string, terms: string[]): string {
  const lower = text.toLowerCase();
  const index = terms
    .map((term) => lower.indexOf(term))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b)[0];
  if (index === undefined) return text.slice(0, SNIPPET_RADIUS * 2).trim();
  const start = Math.max(0, index - SNIPPET_RADIUS);
  const end = Math.min(text.length, index + SNIPPET_RADIUS);
  const slice = text.slice(start, end).replace(/\s+/g, " ").trim();
  return `${start > 0 ? "…" : ""}${slice}${end < text.length ? "…" : ""}`;
}

export function searchDocs(
  docs: readonly SearchDoc[],
  query: string,
  limit = 5,
): SearchHit[] {
  const terms = [...new Set(tokenize(query))];
  if (terms.length === 0) return [];

  return docs
    .map((doc) => {
      const titleTokens = tokenize(doc.title);
      const textTokens = tokenize(doc.text);
      const score = terms.reduce(
        (sum, term) =>
          sum +
          matches(titleTokens, term) * TITLE_WEIGHT +
          matches(textTokens, term),
        0,
      );
      return {
        kind: doc.kind,
        title: doc.title,
        url: doc.url,
        score,
        snippet: snippetAround(doc.text, terms),
      };
    })
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
