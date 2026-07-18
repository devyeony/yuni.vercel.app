/*
 * Shared lexical-matching primitives for the MCP search tool and the site
 * search dialog. Unicode-aware tokenization so Korean matches by prefix
 * within an eojeol ("오픈소스" hits "오픈소스에").
 */

export const tokenize = (value: string): string[] =>
  value.toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? [];

/** How many tokens start with the given (lowercased) term. */
export const countMatches = (tokens: string[], term: string): number =>
  tokens.reduce((n, token) => (token.startsWith(term) ? n + 1 : n), 0);

/** A whitespace-collapsed excerpt around the first occurrence of any term. */
export function snippetAround(
  text: string,
  terms: string[],
  radius = 90,
): string {
  const lower = text.toLowerCase();
  const index = terms
    .map((term) => lower.indexOf(term))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b)[0];
  if (index === undefined) {
    return text
      .slice(0, radius * 2)
      .replace(/\s+/g, " ")
      .trim();
  }
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + radius);
  const slice = text.slice(start, end).replace(/\s+/g, " ").trim();
  return `${start > 0 ? "…" : ""}${slice}${end < text.length ? "…" : ""}`;
}
