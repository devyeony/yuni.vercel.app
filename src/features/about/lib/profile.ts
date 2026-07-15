import type { Locale } from "@/i18n/routing";

/**
 * About-page content as a typed data module — career content never lives in
 * messages/*.json (content architecture rule). Phase 3 migrates structured
 * career data (timeline, talks, publications) into content/data with schema
 * validation; this module carries the narrative and the four-role framing.
 */

type Localized = Record<Locale, string>;

export interface Role {
  key: "backend" | "frontend" | "design" | "planning";
  title: Localized;
  summary: Localized;
  proof: Localized;
}

export const narrative: readonly Localized[] = [
  {
    en: "I'm Yeonhee (yuni) Kim, a software engineer who came to code from the classroom. I taught primary school before switching careers — teaching is where I learned to break hard problems into steps people can actually follow, and I still build software that way.",
    ko: "저는 교실에서 코드로 넘어온 소프트웨어 엔지니어 김연희(yuni)입니다. 초등학교 교사로 일하다 커리어를 전환했어요 — 어려운 문제를 따라올 수 있는 단계로 쪼개는 법을 가르치며 배웠고, 지금도 소프트웨어를 그렇게 만듭니다.",
  },
  {
    en: 'Since then I\'ve shipped backend systems at pet-healthcare and insurtech startups — three years of Java/Spring, now a year and counting of TypeScript/NestJS. Backend is my depth; the rest of the product is my range. In between, a year of living in Dublin — working in English, joining local IT communities, hacking on AI projects — turned "global" from an ambition into a habit.',
    ko: "그 뒤로 펫 헬스케어와 인슈어테크 스타트업에서 백엔드 시스템을 만들어 왔습니다 — Java/Spring 3년, 그리고 지금은 TypeScript/NestJS로 1년째. 백엔드가 저의 깊이라면, 제품의 나머지는 저의 폭입니다. 그 사이 더블린에서 보낸 1년 — 영어로 일하고, 현지 IT 커뮤니티에 참여하고, AI 해커톤을 하며 — '글로벌'은 목표가 아니라 습관이 되었습니다.",
  },
  {
    en: "Lately I've been in open source: lead mentee on the Apache Zeppelin team at OSSCA 2025, where our team took the grand prize (the Minister of Science and ICT award), and back in 2026 as a mentor. Open source, like teaching, is leverage — the work outlives the commit.",
    ko: "요즘은 오픈소스에 있습니다. 2025 오픈소스 컨트리뷰션 아카데미(OSSCA) Apache Zeppelin 팀 리드 멘티로 활동하며 팀이 대상(과학기술정보통신부 장관상)을 받았고, 2026년에는 멘토로 돌아왔습니다. 오픈소스는 가르치는 일처럼 레버리지가 있어요 — 커밋보다 오래 남는 일이니까요.",
  },
];

/** Ordered depth-first: the anchor axis leads, breadth follows. */
export const roles: readonly Role[] = [
  {
    key: "backend",
    title: { en: "Backend", ko: "백엔드" },
    summary: {
      en: "The depth axis: four years across Java/Spring and TypeScript/NestJS — API design, data modeling, and systems that stay boring in production.",
      ko: "깊이의 축: Java/Spring과 TypeScript/NestJS를 아우르는 4년 — API 설계, 데이터 모델링, 그리고 프로덕션에서 조용히 굴러가는 시스템.",
    },
    proof: {
      en: "Shipped at pet-healthcare and insurtech startups; Apache Zeppelin contributor via OSSCA.",
      ko: "펫 헬스케어·인슈어테크 스타트업에서 서비스 출시, OSSCA를 통한 Apache Zeppelin 컨트리뷰터.",
    },
  },
  {
    key: "frontend",
    title: { en: "Frontend", ko: "프론트엔드" },
    summary: {
      en: "React and Next.js, server components first — accessibility and device-adaptive layouts as defaults, not afterthoughts.",
      ko: "React와 Next.js, 서버 컴포넌트 우선 — 접근성과 디바이스 적응형 레이아웃은 나중이 아니라 기본값.",
    },
    proof: {
      en: "This site: RSC-first, axe-scanned, verified across phone, tablet, and desktop viewports.",
      ko: "이 사이트: RSC 우선 구조, axe 자동 스캔, 폰·태블릿·데스크톱 뷰포트 검증.",
    },
  },
  {
    key: "design",
    title: { en: "Design", ko: "디자인" },
    summary: {
      en: "Systems over screens: tokens, type scales, and motion designed as one coherent language.",
      ko: "화면이 아니라 시스템: 토큰, 타입 스케일, 모션을 하나의 언어로 설계.",
    },
    proof: {
      en: "The design system behind this site — three token tiers, ~15 components, zero raw hex.",
      ko: "이 사이트의 디자인 시스템 — 토큰 3계층, 컴포넌트 15종, raw hex 0.",
    },
  },
  {
    key: "planning",
    title: { en: "Planning", ko: "기획" },
    summary: {
      en: "Scoping the problem before the solution: writing the spec, choosing trade-offs, deciding what not to build.",
      ko: "해결책보다 문제를 먼저 정의: 스펙을 쓰고, 트레이드오프를 고르고, 만들지 않을 것을 결정.",
    },
    proof: {
      en: "This site runs plan-first — roadmap, ADRs, and non-goals written before the code.",
      ko: "이 사이트는 계획 우선으로 만들어집니다 — 로드맵, ADR, 비목표를 코드보다 먼저.",
    },
  },
];
