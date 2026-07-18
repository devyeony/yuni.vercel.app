# ADR-0003: Build-time RAG index without a vector database

- Status: accepted
- Date: 2026-07-18

## Context

The "Ask my portfolio" chatbot and semantic site search need vector
retrieval over the site's content. The content corpus is small (dozens of
chunks, growing slowly with posts and projects) and fully public. The
project's constraints: no paid services, no runtime dependencies that can
disappear, and the pipeline should demonstrate engineering judgment — a
vector database for a portfolio would be exactly the over-engineering the
non-goals ban.

## Decision

Embed at build time, ship the index as a static JSON asset, search with
in-memory cosine similarity:

- `scripts/build-rag-index.mjs` runs at the head of `pnpm build`: it chunks
  every content collection (project spines and MDX sections, post sections,
  locale-keyed careers/activities/now) and embeds them locally with
  **Transformers.js + `Xenova/multilingual-e5-small`** (quantized, free,
  multilingual — one index covers en and ko queries; e5's `passage:` /
  `query:` role prefixes are required).
- The output is **`public/rag-index.json`** (~120 kB for the current
  corpus): servable to the client for LLM-free semantic search, readable by
  the chat API route. At this scale, cosine over an array beats operating
  any vector store.
- **Self-verifying**: the script runs smoke retrievals in both locales and
  fails the build if a relevant chunk doesn't rank top-3 — the index cannot
  ship broken.
- **Hash-skip**: content hash + model id stored in the index; unchanged
  content skips embedding entirely (sub-second rebuilds).
- The model caches to a repo-local `.cache/transformers`, cached in CI
  (actions/cache) and by Vercel's build cache.

## Consequences

- Zero runtime cost and zero external moving parts for retrieval; the
  chatbot's only runtime dependency is the generation LLM (separately
  adapter-wrapped, ADR to come with the chat route).
- Content updates automatically reflow into retrieval — same single-source
  pipeline as pages, feeds, and the future MCP tools.
- Cold builds pay a one-time model download (~30 MB, cached thereafter).
- If the corpus ever outgrows in-memory search (thousands of chunks), the
  index format isolates that change to the search function — but that
  scale is out of scope for a personal site by design.
