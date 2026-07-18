/*
 * Build-time RAG index (PLAN §7-1): chunk every content collection, embed
 * locally with a free multilingual model, and ship a static JSON index —
 * no vector DB, no paid API. Serverless cosine search + the client reuse
 * both read public/rag-index.json.
 *
 * Self-verifying: after embedding, a smoke retrieval in both locales must
 * rank a relevant chunk in the top 3 or the build fails.
 */
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

const MODEL = "Xenova/multilingual-e5-small";
const OUT = "public/rag-index.json";
const MAX_CHUNK = 1200; // chars — e5-small has a 512-token window

/* Fresh collections first (fast when warm). */
execSync("pnpm exec content-collections build", { stdio: "inherit" });

const { allProjects, allPosts, allCareers, allActivities, now } = await import(
  "../.content-collections/generated/index.js"
);

/** Split MDX body into heading-bounded sections, capped at MAX_CHUNK. */
function sectionize(markdown) {
  const sections = markdown
    .split(/\n(?=## )/)
    .map((s) => s.replace(/```[\s\S]*?```/g, "").trim())
    .filter(Boolean);
  return sections.flatMap((section) => {
    if (section.length <= MAX_CHUNK) return [section];
    const parts = [];
    let current = "";
    for (const para of section.split(/\n\n+/)) {
      if (current && current.length + para.length > MAX_CHUNK) {
        parts.push(current);
        current = para;
      } else {
        current = current ? `${current}\n\n${para}` : para;
      }
    }
    if (current) parts.push(current);
    return parts;
  });
}

const chunks = [];
const add = (id, locale, url, title, text) =>
  chunks.push({ id, locale, url, title, text: text.trim() });

for (const p of allProjects.filter((p) => !p.draft)) {
  const base = `project:${p.locale}:${p.slug}`;
  const url = `/projects/${p.slug}`;
  add(
    `${base}:facts`,
    p.locale,
    url,
    p.title,
    [
      `${p.title} — ${p.summary}`,
      `Problem: ${p.problem}`,
      ...p.decisions.map(
        (d) => `Decision: ${d.decision}. Trade-off: ${d.tradeoff}`,
      ),
      `Outcomes: ${p.outcomes.join(" ")}`,
      `Stack: ${p.stack.join(", ")}`,
    ].join("\n"),
  );
  sectionize(p.content).forEach((text, i) => {
    add(`${base}:body-${i}`, p.locale, url, p.title, text);
  });
}

for (const post of allPosts.filter((p) => !p.draft)) {
  const base = `post:${post.locale}:${post.slug}`;
  const url = `/blog/${post.slug}`;
  add(
    `${base}:summary`,
    post.locale,
    url,
    post.title,
    `${post.title} — ${post.summary}`,
  );
  sectionize(post.content).forEach((text, i) => {
    add(`${base}:body-${i}`, post.locale, url, post.title, text);
  });
}

for (const locale of ["en", "ko"]) {
  for (const c of allCareers) {
    add(
      `career:${locale}:${c._meta.path}`,
      locale,
      "/about",
      c.company[locale],
      `${c.role[locale]} · ${c.company[locale]} (${c.period.start}–${c.period.end ?? "present"})\n${c.summary[locale]}\nStack: ${c.stack.join(", ")}`,
    );
  }
  for (const a of allActivities) {
    add(
      `activity:${locale}:${a._meta.path}`,
      locale,
      "/about",
      a.title[locale],
      [
        `${a.title[locale]}${a.org ? ` — ${a.org[locale]}` : ""} (${a.date}${a.endDate ? `–${a.endDate}` : ""})`,
        a.note?.[locale] ?? "",
      ].join("\n"),
    );
  }
  add(
    `now:${locale}`,
    locale,
    "/",
    "Now",
    [now.availability.label[locale], ...now.focus.map((f) => f[locale])].join(
      "\n",
    ),
  );
}

/* Hash-skip: unchanged content + same model → keep the existing index. */
const contentHash = createHash("sha256")
  .update(MODEL)
  .update(JSON.stringify(chunks))
  .digest("hex");

if (existsSync(OUT)) {
  const existing = JSON.parse(readFileSync(OUT, "utf8"));
  if (existing.contentHash === contentHash) {
    console.log(
      `rag-index: unchanged (${existing.chunks.length} chunks) — skipped`,
    );
    process.exit(0);
  }
}

const { env, pipeline } = await import("@huggingface/transformers");
env.cacheDir = ".cache/transformers"; // repo-local so CI can cache it

const embedder = await pipeline("feature-extraction", MODEL, { dtype: "q8" });

/** e5 requires role prefixes: "passage: " for documents, "query: " for queries. */
async function embed(texts, role) {
  const output = await embedder(
    texts.map((t) => `${role}: ${t}`),
    { pooling: "mean", normalize: true },
  );
  const [n, dims] = [texts.length, output.dims.at(-1)];
  const data = output.data;
  return Array.from({ length: n }, (_, i) =>
    Array.from(data.slice(i * dims, (i + 1) * dims), (v) =>
      Number(v.toFixed(5)),
    ),
  );
}

const vectors = await embed(
  chunks.map((c) => c.text),
  "passage",
);
const indexed = chunks.map((c, i) => ({ ...c, vec: vectors[i] }));

/* Smoke retrieval — the index must actually retrieve before it ships. */
const cosine = (a, b) => a.reduce((sum, v, i) => sum + v * b[i], 0);
const smokes = [
  {
    locale: "en",
    query: "What backend experience does she have with Java and Spring?",
    expect: /petping|career/,
  },
  {
    locale: "ko",
    query: "오픈소스 활동 경험이 있나요?",
    expect: /activity|ossca|zeppelin/i,
  },
];
for (const { locale, query, expect } of smokes) {
  const [qvec] = await embed([query], "query");
  const top = indexed
    .filter((c) => c.locale === locale)
    .map((c) => ({ id: c.id, score: cosine(qvec, c.vec) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  if (!top.some((t) => expect.test(t.id))) {
    console.error(`rag-index: smoke retrieval failed for "${query}"`, top);
    process.exit(1);
  }
  console.log(
    `rag-index: smoke ok "${query}" → ${top[0].id} (${top[0].score.toFixed(3)})`,
  );
}

mkdirSync("public", { recursive: true });
writeFileSync(
  OUT,
  JSON.stringify({
    model: MODEL,
    dims: indexed[0].vec.length,
    contentHash,
    chunks: indexed,
  }),
);
console.log(
  `rag-index: ${indexed.length} chunks, ${indexed[0].vec.length} dims → ${OUT} (${Math.round(readFileSync(OUT).length / 1024)} kB)`,
);
