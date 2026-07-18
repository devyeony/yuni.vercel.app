import type { Locale } from "@/i18n/routing";
import { site } from "@/lib/site";

/**
 * Colophon content as a typed data module — editorial narrative stays out of
 * messages/*.json (content architecture rule); messages carry only the short
 * UI strings. This page narrates the process behind the site: the agent
 * harness (§ADR-0001), the single-source content pipeline, and the MCP server.
 */

type Localized = Record<Locale, string>;

export interface Principle {
  key: "single-source" | "machine-enforced" | "one-loop";
  title: Localized;
  body: Localized;
}

/** The agent harness, in three principles (ADR-0001). */
export const principles: readonly Principle[] = [
  {
    key: "single-source",
    title: {
      en: "One source, any agent",
      ko: "하나의 소스, 어떤 에이전트든",
    },
    body: {
      en: "The only committed instructions are vendor-neutral: AGENTS.md plus five portable skills under agents/. CLAUDE.md, GEMINI.md, and .cursor/ are generated adapters — gitignored, rebuilt with one command. Swap the agent; keep the harness.",
      ko: "커밋되는 지침은 벤더 중립뿐입니다: AGENTS.md와 agents/ 아래 포터블 스킬 다섯 개. CLAUDE.md, GEMINI.md, .cursor/는 생성된 어댑터로 — gitignore 처리되고 명령 한 번이면 다시 만들어집니다. 에이전트는 갈아 끼워도 하네스는 남습니다.",
    },
  },
  {
    key: "machine-enforced",
    title: {
      en: "Rules are enforced by machines, not prompts",
      ko: "규칙은 프롬프트가 아니라 기계가 강제",
    },
    body: {
      en: "Raw hex colors, broken dependency directions, asymmetric translation keys, malformed commits — none of it relies on an agent remembering an instruction. Biome, tsc, commitlint, and a few small scripts catch violations before merge, whether the author is human or model.",
      ko: "raw hex 색상, 어긋난 의존 방향, 비대칭 번역 키, 형식 밖의 커밋 — 어느 것도 에이전트의 기억력에 기대지 않습니다. Biome, tsc, commitlint와 작은 스크립트들이 머지 전에 위반을 잡아냅니다. 작성자가 사람이든 모델이든.",
    },
  },
  {
    key: "one-loop",
    title: {
      en: "One loop, everywhere",
      ko: "하나의 루프, 어디서나",
    },
    body: {
      en: "Any agent verifies its own work with two commands: pnpm check (static analysis, seconds) and pnpm verify (a production build plus Playwright at phone, tablet, and desktop widths). CI reruns the exact same loop — nothing “only breaks in CI”.",
      ko: "어떤 에이전트든 두 명령으로 자기 작업을 검증합니다: pnpm check(정적 분석, 수 초)와 pnpm verify(프로덕션 빌드 + 폰·태블릿·데스크톱 폭의 Playwright). CI는 정확히 같은 루프를 다시 돌립니다 — “CI에서만 깨지는” 일은 없습니다.",
    },
  },
];

export interface Surface {
  key: "pages" | "feeds" | "embeddings" | "mcp";
  name: Localized;
  detail: Localized;
}

/** Where a single content entry propagates, with zero component changes. */
export const surfaces: readonly Surface[] = [
  {
    key: "pages",
    name: { en: "Pages", ko: "페이지" },
    detail: {
      en: "Every route renders from the same schema-validated collections — projects, posts, career data, the Now status.",
      ko: "모든 라우트가 같은 스키마 검증 컬렉션에서 렌더링됩니다 — 프로젝트, 글, 경력 데이터, Now 상태까지.",
    },
  },
  {
    key: "feeds",
    name: { en: "Feeds", ko: "피드" },
    detail: {
      en: "RSS and Atom in both locales, plus llms.txt for AI crawlers — the blog ships over standard protocols.",
      ko: "양 로케일의 RSS·Atom, 그리고 AI 크롤러를 위한 llms.txt — 블로그는 표준 프로토콜로 배포됩니다.",
    },
  },
  {
    key: "embeddings",
    name: { en: "Embedding index", ko: "임베딩 인덱스" },
    detail: {
      en: "Computed at build time; it powers the recommendations, the 2D map, and site search with zero runtime AI calls.",
      ko: "빌드 시점에 계산되어 유사 콘텐츠 추천, 2D 지도, 사이트 검색을 런타임 AI 호출 없이 구동합니다.",
    },
  },
  {
    key: "mcp",
    name: { en: "MCP tools", ko: "MCP 툴" },
    detail: {
      en: "Six read-only tools serve the very same collections to any AI client you connect.",
      ko: "읽기 전용 툴 여섯 개가 똑같은 컬렉션을, 연결된 어떤 AI 클라이언트에든 제공합니다.",
    },
  },
];

export interface Restraint {
  key: string;
  thing: Localized;
  reason: Localized;
}

/** Things deliberately not built — the decision records tell the longer story. */
export const restraints: readonly Restraint[] = [
  {
    key: "chatbot",
    thing: { en: "A RAG chatbot", ko: "RAG 챗봇" },
    reason: {
      en: "A wrapper around someone else's model proves little and fails loudly. The embeddings became things you can see instead: recommendations, the 2D map, search.",
      ko: "남의 모델을 감싼 래퍼는 증명하는 것이 적고, 틀릴 때는 요란하게 틀립니다. 임베딩은 대신 눈에 보이는 것들이 되었습니다 — 추천, 2D 지도, 검색.",
    },
  },
  {
    key: "vector-db",
    thing: { en: "A vector database", ko: "벡터 데이터베이스" },
    reason: {
      en: "The whole corpus fits in a 125 kB JSON file, and cosine similarity is a for-loop (ADR-0003).",
      ko: "코퍼스 전체가 125kB JSON 파일에 들어가고, 코사인 유사도는 for 루프면 충분합니다 (ADR-0003).",
    },
  },
  {
    key: "runtime-embedding",
    thing: { en: "Runtime query embedding", ko: "런타임 쿼리 임베딩" },
    reason: {
      en: "The multilingual model weighs about 130 MB — too heavy for a browser, too cold for serverless. Search is a static hybrid over the build-time index instead (ADR-0004).",
      ko: "다국어 모델은 약 130MB — 브라우저에는 무겁고 서버리스에는 차갑습니다. 검색은 빌드타임 인덱스 위의 정적 하이브리드로 대신합니다 (ADR-0004).",
    },
  },
  {
    key: "contact-form",
    thing: { en: "A contact form", ko: "연락 폼" },
    reason: {
      en: "Built completely, then removed: a mailto link with a prefilled subject has zero failure modes and no third-party delivery service (ADR-0005).",
      ko: "완전히 만들었다가 걷어냈습니다. 제목이 채워진 mailto 링크에는 실패 모드가 없고, 외부 배송 서비스도 필요 없습니다 (ADR-0005).",
    },
  },
  {
    key: "state-library",
    thing: { en: "A state-management library", ko: "상태관리 라이브러리" },
    reason: {
      en: "Server components carry the state and the URL carries the rest — the store would have managed one theme toggle.",
      ko: "상태는 서버 컴포넌트가, 나머지는 URL이 듭니다 — 스토어를 들였다면 관리할 것은 테마 토글 하나였을 겁니다.",
    },
  },
];

export interface StackItem {
  name: string;
  note: Localized;
}

export const stack: readonly StackItem[] = [
  {
    name: "Next.js 16",
    note: {
      en: "App Router, server components first — client code only at the leaves.",
      ko: "App Router, 서버 컴포넌트 우선 — 클라이언트 코드는 잎에만.",
    },
  },
  {
    name: "TypeScript",
    note: {
      en: "Strict, no any: the types are where the design is written down.",
      ko: "strict, any 금지 — 타입이 곧 설계가 적히는 자리입니다.",
    },
  },
  {
    name: "Tailwind CSS v4",
    note: {
      en: "CSS-first @theme tokens in three tiers; components touch only the semantic tier.",
      ko: "CSS-first @theme 토큰 3계층 — 컴포넌트는 시맨틱 계층만 만집니다.",
    },
  },
  {
    name: "Base UI + CVA",
    note: {
      en: "Headless primitives for behavior and accessibility; every pixel of styling is owned here.",
      ko: "동작과 접근성만 맡는 헤드리스 프리미티브 — 스타일은 전부 이 레포의 소유입니다.",
    },
  },
  {
    name: "next-intl",
    note: {
      en: "English and Korean as full locales, with key symmetry enforced in CI.",
      ko: "영어와 한국어를 완전한 로케일로 — 키 대칭은 CI가 강제합니다.",
    },
  },
  {
    name: "Content Collections",
    note: {
      en: "Zod-validated MDX and YAML: the single source behind every surface above.",
      ko: "Zod로 검증되는 MDX와 YAML — 위 모든 표면의 단일 소스입니다.",
    },
  },
  {
    name: "Vitest + Playwright",
    note: {
      en: "Behavior over implementation: unit tests, axe accessibility scans, visual regression, and smoke at three viewports.",
      ko: "구현이 아닌 행동을 테스트 — 단위 테스트, axe 접근성 스캔, 시각 회귀, 3개 뷰포트 스모크.",
    },
  },
  {
    name: "Biome",
    note: {
      en: "One tool for lint and format, wired into pre-commit and CI.",
      ko: "린트와 포맷을 도구 하나로 — pre-commit과 CI에 연결됩니다.",
    },
  },
  {
    name: "Vercel",
    note: {
      en: "A preview per PR, production on merge — no hand deploys.",
      ko: "PR마다 프리뷰, 머지하면 프로덕션 — 수동 배포는 없습니다.",
    },
  },
];

export interface Typeface {
  name: string;
  role: Localized;
}

export const typefaces: readonly Typeface[] = [
  {
    name: "Fraunces",
    role: {
      en: "Display serif — the editorial voice.",
      ko: "디스플레이 세리프 — 에디토리얼의 목소리.",
    },
  },
  {
    name: "Instrument Sans",
    role: { en: "Body text.", ko: "본문." },
  },
  {
    name: "JetBrains Mono",
    role: { en: "Code and labels.", ko: "코드와 라벨." },
  },
  {
    name: "Pretendard",
    role: {
      en: "Korean text — subset, loaded only on the ko locale.",
      ko: "한국어 본문 — 서브셋으로 ko 로케일에서만 로드됩니다.",
    },
  },
];

/** The MCP appeal set: one copy-paste line, the endpoint, the tool roster. */
export const mcp = {
  endpoint: `${site.url}/api/mcp`,
  addCommand: `claude mcp add --transport http yuni ${site.url}/api/mcp`,
  tools: [
    "get_profile",
    "list_projects",
    "get_project",
    "list_posts",
    "get_post",
    "search_content",
  ],
} as const;
