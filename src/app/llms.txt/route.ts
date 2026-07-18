import { postsForLocale } from "@/features/blog/lib/collection";
import { projectsForLocale } from "@/features/projects/lib/collection";
import { getPathname } from "@/i18n/navigation";
import { site } from "@/lib/site";
import en from "../../../messages/en.json";

/*
 * llms.txt (https://llmstxt.org) — an AI-crawler-friendly index of the site
 * (§7-3). Built from the same content collections as the pages, so new
 * entries appear here with zero component changes. English-primary, like
 * the site; Korean pages are reachable via the noted /ko prefix.
 */

export const dynamic = "force-static";

const url = (href: string) =>
  `${site.url}${getPathname({ locale: "en", href })}`;

export function GET() {
  const projects = projectsForLocale("en");
  const posts = postsForLocale("en");

  const lines = [
    `# ${site.name} — ${site.author}`,
    "",
    `> ${en.meta.description}`,
    "",
    `Personal portfolio site — the site itself is a portfolio piece: architecture, design system, and process are on display. English is the primary locale; Korean lives under ${site.url}/ko.`,
    "",
    `This portfolio is also an MCP server: connect your client to ${site.url}/api/mcp (Streamable HTTP) for read-only tools — get_profile, list_projects, get_project, list_posts, get_post, search_content.`,
    "",
    "## Pages",
    "",
    `- [About](${url("/about")}): narrative and the four-role framing (backend depth, whole-product range)`,
    `- [Projects](${url("/projects")}): case studies with problem, decisions, and outcomes`,
    `- [Blog](${url("/blog")}): notes from building software`,
    `- [Design system](${url("/design")}): tokens, components, and motion of this site`,
    `- [Embedding map](${url("/embeddings")}): all content projected from 384-dimensional embeddings to 2D`,
    `- [Contact](${url("/contact")}): reach out about hiring, collaboration, or a coffee chat`,
    `- [Colophon](${url("/colophon")}): how the site is made — the agent harness, the content pipeline, and the MCP server`,
    "",
    "## Projects",
    "",
    ...projects.map(
      (project) =>
        `- [${project.title}](${url(`/projects/${project.slug}`)}): ${project.summary}`,
    ),
    "",
    "## Blog posts",
    "",
    ...posts.map(
      (post) =>
        `- [${post.title}](${url(`/blog/${post.slug}`)}): ${post.summary}`,
    ),
    "",
    "## Data",
    "",
    `- [RSS feed](${url("/feed.xml")}): blog over standard protocols (Atom at /atom.xml; Korean feeds under /ko)`,
    `- [Embedding index](${site.url}/rag-index.json): build-time multilingual embeddings of all content`,
  ];

  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
