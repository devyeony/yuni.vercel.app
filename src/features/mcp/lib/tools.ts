import { now } from "content-collections";
import {
  activitiesOfKind,
  activityKinds,
  careersByRecency,
} from "@/features/about/lib/data";
import { narrative, roles } from "@/features/about/lib/profile";
import { postBySlug, postsForLocale } from "@/features/blog/lib/collection";
import {
  projectBySlug,
  projectsForLocale,
} from "@/features/projects/lib/collection";
import { getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { site } from "@/lib/site";
import en from "../../../../messages/en.json";
import ko from "../../../../messages/ko.json";
import { type SearchDoc, searchDocs } from "./search";

/*
 * Read-only MCP tool implementations over the same content pipeline that
 * renders the site (§7-2): one entry added to content/ updates pages, feeds,
 * the RAG index, and these tool responses together. Nothing here mutates
 * state or reads anything that isn't already public on the site.
 */

const messages = { en, ko } as const;

const url = (locale: Locale, href: string) =>
  `${site.url}${getPathname({ locale, href })}`;

export function getProfile(locale: Locale) {
  return {
    name: site.author,
    handle: site.name,
    headline: messages[locale].meta.description,
    availability: {
      open: now.availability.open,
      label: now.availability.label[locale],
      focus: now.focus.map((item) => item[locale]),
      updated: now.updated,
    },
    narrative: narrative.map((paragraph) => paragraph[locale]),
    roles: roles.map((role) => ({
      key: role.key,
      title: role.title[locale],
      summary: role.summary[locale],
      proof: role.proof[locale],
    })),
    careers: careersByRecency().map((career) => ({
      company: career.company[locale],
      role: career.role[locale],
      summary: career.summary[locale],
      period: career.period,
      stack: career.stack,
    })),
    activities: Object.fromEntries(
      activityKinds.map((kind) => [
        kind,
        activitiesOfKind(kind).map((activity) => ({
          title: activity.title[locale],
          org: activity.org?.[locale],
          date: activity.date,
          endDate: activity.endDate,
          note: activity.note?.[locale],
          link: activity.link,
        })),
      ]),
    ),
    links: { site: site.url, ...site.social },
  };
}

export function listProjects(locale: Locale) {
  return projectsForLocale(locale).map((project) => ({
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    period: project.period,
    stack: project.stack,
    roles: project.roles,
    featured: project.featured,
    url: url(locale, `/projects/${project.slug}`),
  }));
}

export function getProject(locale: Locale, slug: string) {
  const project = projectBySlug(locale, slug);
  if (!project) return null;
  return {
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    period: project.period,
    stack: project.stack,
    roles: project.roles,
    problem: project.problem,
    decisions: project.decisions,
    outcomes: project.outcomes,
    links: project.links,
    url: url(locale, `/projects/${project.slug}`),
    content: project.content,
  };
}

export function listPosts(locale: Locale) {
  return postsForLocale(locale).map((post) => ({
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    date: post.date,
    tags: post.tags,
    readingMinutes: post.readingMinutes,
    url: url(locale, `/blog/${post.slug}`),
  }));
}

export function getPost(locale: Locale, slug: string) {
  const post = postBySlug(locale, slug);
  if (!post) return null;
  return {
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    date: post.date,
    tags: post.tags,
    readingMinutes: post.readingMinutes,
    url: url(locale, `/blog/${post.slug}`),
    content: post.content,
  };
}

export function searchContent(locale: Locale, query: string, limit?: number) {
  const docs: SearchDoc[] = [
    ...projectsForLocale(locale).map(
      (project): SearchDoc => ({
        kind: "project",
        title: project.title,
        text: [
          project.summary,
          project.problem,
          ...project.outcomes,
          project.content,
        ].join("\n"),
        url: url(locale, `/projects/${project.slug}`),
      }),
    ),
    ...postsForLocale(locale).map(
      (post): SearchDoc => ({
        kind: "post",
        title: post.title,
        text: `${post.summary}\n${post.content}`,
        url: url(locale, `/blog/${post.slug}`),
      }),
    ),
    ...activityKinds.flatMap((kind) =>
      activitiesOfKind(kind).map(
        (activity): SearchDoc => ({
          kind: "activity",
          title: activity.title[locale],
          text: [activity.org?.[locale], activity.note?.[locale]]
            .filter(Boolean)
            .join("\n"),
          url: url(locale, "/about"),
        }),
      ),
    ),
  ];
  return searchDocs(docs, query, limit);
}
