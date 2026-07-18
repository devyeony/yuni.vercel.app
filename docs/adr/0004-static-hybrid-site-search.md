# ADR-0004: Static hybrid site search instead of runtime query embedding

- Status: accepted
- Date: 2026-07-18

## Context

Semantic site search is the one AI-layer feature that seems to require
embedding a query at runtime — the plan's candidate was lazy-loading the
index model (Transformers.js WASM) in the browser as progressive
enhancement, with the final method deferred to implementation.

Measured reality killed that candidate: `Xenova/multilingual-e5-small` is
113 MB quantized plus a 16 MB tokenizer. Multilingual embedding models
cannot be much smaller — the 250k-token vocabulary dominates the parameter
count — so "the visitor's first search downloads ~129 MB" is inherent, not
a tuning problem. The remaining options:

1. **Serverless query embedding** (`/api/search` running the same model in
   Node): genuinely semantic for any phrasing, but a 3–8 s cold start on
   the first search, function size near Vercel's 250 MB limit (model +
   onnxruntime native binaries), and it breaks the post-chatbot-removal
   narrative that the AI layer is entirely build-time static.
2. **Static hybrid**: search the existing 125 kB `rag-index.json` on the
   client — lexical matching finds foothold chunks, and their stored
   384-dim vectors expand the result set through embedding space.
3. **Lexical only**: reuse the MCP keyword scorer and drop the semantic
   claim.

## Decision

Option 2, the static hybrid (`src/features/search/lib/engine.ts`):

- Tokenized lexical scoring (title-weighted, Korean eojeol prefix
  matching) selects seed chunks; their vectors, weighted by lexical score,
  form a pseudo query vector; cosine against every chunk vector ranks the
  rest of the corpus.
- Results are presented honestly in two groups: **Matches** (lexical) and
  **Nearby in embedding space** (no shared words, cosine ≥ 0.8, score
  shown) — the mechanism is the UI, consistent with the related-content
  block and the embedding map exposing their cosine scores.
- The index is fetched once on first open of the search dialog (~125 kB,
  the same file the map and MCP features already derive from) and searched
  in memory. No runtime model, no search backend, no cold start.

## Consequences

- Search is instant and free at any traffic level, works offline once the
  index is cached, and inherits new content automatically — one content
  entry updates pages, feeds, MCP, the map, and search together.
- The semantic half is an approximation: a query whose terms appear
  nowhere in the corpus returns nothing, because there is no vector to
  start from ("ML" only finds machine-learning content if some chunk
  contains "ML"). Accepted for a 34-chunk corpus where lexical footholds
  are dense; the trade-off is documented in the UI copy and colophon
  rather than hidden.
- If true any-phrasing semantic search ever becomes worth a cold start,
  option 1 can be added behind the same engine interface without touching
  the UI.
