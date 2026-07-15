import { expect, test } from "@playwright/test";

// Asserts the security headers configured in next.config.ts are actually
// served — the presence check required by AGENTS.md's security defaults.
test("responses carry the security headers", async ({ request }) => {
  const response = await request.get("/en");
  expect(response.ok()).toBe(true);

  const headers = response.headers();
  expect(headers["content-security-policy"]).toContain("default-src 'self'");
  expect(headers["content-security-policy"]).toContain(
    "frame-ancestors 'none'",
  );
  expect(headers["content-security-policy"]).not.toContain("unsafe-eval");
  expect(headers["strict-transport-security"]).toContain("max-age=");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");
});
