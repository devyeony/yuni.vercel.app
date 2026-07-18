import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import {
  getPost,
  getProfile,
  getProject,
  listPosts,
  listProjects,
  searchContent,
} from "@/features/mcp/lib/tools";
import { routing } from "@/i18n/routing";
import { rateLimit } from "@/lib/rate-limit";
import { site } from "@/lib/site";

/*
 * The portfolio as an MCP server (§7-2): visitors connect their client to
 * `${site.url}/api/mcp` (Streamable HTTP) and query the same content the
 * site renders. Read-only by design — every tool serves public content, so
 * there is no auth surface; SSE transport stays off (no Redis dependency).
 */

const json = (data: unknown) => ({
  content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
});

const notFound = (what: string) => ({
  content: [{ type: "text" as const, text: `Not found: ${what}` }],
  isError: true,
});

const readOnly = { readOnlyHint: true, openWorldHint: false };

const locale = z
  .enum(routing.locales)
  .default(routing.defaultLocale)
  .describe('Content locale: "en" (default) or "ko"');

const slug = z.string().min(1).max(200);

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "get_profile",
      {
        description:
          "Profile of Yeonhee (yuni) Kim: positioning, availability, narrative, roles, career history, and activities (open source, talks, publications).",
        inputSchema: { locale },
        annotations: readOnly,
      },
      async (args) => json(getProfile(args.locale)),
    );

    server.registerTool(
      "list_projects",
      {
        description:
          "List project case studies with per-role contributions, stack, and links.",
        inputSchema: { locale },
        annotations: readOnly,
      },
      async (args) => json(listProjects(args.locale)),
    );

    server.registerTool(
      "get_project",
      {
        description:
          "Full case study for one project by slug: problem, decisions with trade-offs, outcomes, and the write-up body.",
        inputSchema: { locale, slug },
        annotations: readOnly,
      },
      async (args) => {
        const project = getProject(args.locale, args.slug);
        return project
          ? json(project)
          : notFound(`project "${args.slug}" (${args.locale})`);
      },
    );

    server.registerTool(
      "list_posts",
      {
        description: "List blog posts with summaries, dates, and tags.",
        inputSchema: { locale },
        annotations: readOnly,
      },
      async (args) => json(listPosts(args.locale)),
    );

    server.registerTool(
      "get_post",
      {
        description: "Full blog post by slug, including the article body.",
        inputSchema: { locale, slug },
        annotations: readOnly,
      },
      async (args) => {
        const post = getPost(args.locale, args.slug);
        return post
          ? json(post)
          : notFound(`post "${args.slug}" (${args.locale})`);
      },
    );

    server.registerTool(
      "search_content",
      {
        description:
          "Keyword search across projects, posts, and activities. Returns scored hits with snippets and site URLs.",
        inputSchema: {
          locale,
          query: z.string().min(1).max(200),
          limit: z.number().int().min(1).max(20).default(5),
        },
        annotations: readOnly,
      },
      async (args) => json(searchContent(args.locale, args.query, args.limit)),
    );
  },
  { serverInfo: { name: `${site.name}-portfolio`, version: "1.0.0" } },
  { basePath: "/api", disableSse: true, maxDuration: 60 },
);

/* Rate-limited per client IP — the security default for every API route. */
function guarded(request: Request): Promise<Response> | Response {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const gate = rateLimit(`mcp:${ip}`);
  if (!gate.ok) {
    return new Response(
      JSON.stringify({
        jsonrpc: "2.0",
        error: { code: -32000, message: "Rate limit exceeded" },
        id: null,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(gate.retryAfterSeconds),
        },
      },
    );
  }
  return handler(request);
}

export { guarded as DELETE, guarded as GET, guarded as POST };
