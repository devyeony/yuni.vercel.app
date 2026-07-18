import { expect, test } from "@playwright/test";

/*
 * MCP server smoke (§7-2): the JSON-RPC handshake and read-only tools over
 * Streamable HTTP. Responses arrive as a single SSE message; unwrap it.
 */

const MCP = "/api/mcp";
const HEADERS = {
  "content-type": "application/json",
  accept: "application/json, text/event-stream",
};

// biome-ignore lint/suspicious/noExplicitAny: JSON-RPC payloads are untyped here
function unwrapSse(body: string): any {
  const data = body.split("\n").find((line) => line.startsWith("data: "));
  if (!data) throw new Error(`no SSE data line in response: ${body}`);
  return JSON.parse(data.slice("data: ".length));
}

const initializeRequest = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2025-03-26",
    capabilities: {},
    clientInfo: { name: "e2e", version: "0.0.0" },
  },
};

test.describe("MCP server", () => {
  test("initialize handshake identifies the portfolio server", async ({
    request,
  }) => {
    const response = await request.post(MCP, {
      headers: HEADERS,
      data: initializeRequest,
    });
    expect(response.status()).toBe(200);
    const message = unwrapSse(await response.text());
    expect(message.result.serverInfo.name).toBe("yuni-portfolio");
  });

  test("exposes exactly the read-only tool set", async ({ request }) => {
    const response = await request.post(MCP, {
      headers: HEADERS,
      data: { jsonrpc: "2.0", id: 2, method: "tools/list" },
    });
    const message = unwrapSse(await response.text());
    const names = message.result.tools
      .map((tool: { name: string }) => tool.name)
      .sort();
    expect(names).toEqual([
      "get_post",
      "get_profile",
      "get_project",
      "list_posts",
      "list_projects",
      "search_content",
    ]);
    for (const tool of message.result.tools) {
      expect(tool.annotations?.readOnlyHint).toBe(true);
    }
  });

  test("get_profile returns the positioning and availability", async ({
    request,
  }) => {
    const response = await request.post(MCP, {
      headers: HEADERS,
      data: {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: { name: "get_profile", arguments: { locale: "en" } },
      },
    });
    const message = unwrapSse(await response.text());
    const profile = JSON.parse(message.result.content[0].text);
    expect(profile.name).toBe("Yeonhee Hayden Kim");
    expect(profile.headline).toContain("Software engineer");
    expect(profile.roles.map((r: { key: string }) => r.key)).toContain(
      "backend",
    );
  });

  test("search_content finds the Petping case study for both locales", async ({
    request,
  }) => {
    for (const [locale, query] of [
      ["en", "Java Spring backend"],
      ["ko", "오픈소스"],
    ] as const) {
      const response = await request.post(MCP, {
        headers: HEADERS,
        data: {
          jsonrpc: "2.0",
          id: 4,
          method: "tools/call",
          params: { name: "search_content", arguments: { locale, query } },
        },
      });
      const message = unwrapSse(await response.text());
      const hits = JSON.parse(message.result.content[0].text);
      expect(hits.length).toBeGreaterThan(0);
      expect(hits[0].url).toContain("https://");
    }
  });

  test("rejects malformed tool arguments", async ({ request }) => {
    const response = await request.post(MCP, {
      headers: HEADERS,
      data: {
        jsonrpc: "2.0",
        id: 5,
        method: "tools/call",
        params: { name: "get_project", arguments: { locale: "fr" } },
      },
    });
    const message = unwrapSse(await response.text());
    expect(message.error ?? message.result?.isError).toBeTruthy();
  });
});

test("llms.txt indexes the site for AI crawlers", async ({ request }) => {
  const response = await request.get("/llms.txt");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("text/markdown");
  const body = await response.text();
  expect(body).toContain("# yuni — Yeonhee Hayden Kim");
  expect(body).toContain("/projects/petping");
  expect(body).toContain("/api/mcp");
});
