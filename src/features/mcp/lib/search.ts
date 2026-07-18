import { countMatches, snippetAround, tokenize } from "@/lib/lexical";

/*
 * Keyword scoring for the MCP `search_content` tool. Deliberately lexical,
 * not semantic: runtime query embedding would pull the model into the
 * serverless function, and the AI layer stays build-time static (§7-1).
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
          countMatches(titleTokens, term) * TITLE_WEIGHT +
          countMatches(textTokens, term),
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
