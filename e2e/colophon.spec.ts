import { expect, test } from "@playwright/test";

/*
 * The colophon carries the MCP appeal set: a copy-paste connect command,
 * the endpoint, and a demo recording with a reduced-motion still.
 */

const addCommand =
  "claude mcp add --transport http yuni https://yuni.vercel.app/api/mcp";

for (const prefix of ["/en", "/ko"] as const) {
  test(`${prefix}/colophon shows the MCP connect set`, async ({ page }) => {
    await page.goto(`${prefix}/colophon`);
    await expect(page.getByText(addCommand)).toBeVisible();
    await expect(
      page.getByText("https://yuni.vercel.app/api/mcp").first(),
    ).toBeVisible();
    for (const tool of ["get_profile", "search_content"]) {
      await expect(page.getByText(tool)).toBeVisible();
    }
    await expect(page.locator("figure img")).toHaveAttribute("alt", /.+/);
  });
}

test("the MCP demo assets are served", async ({ request }) => {
  for (const asset of [
    "/colophon/mcp-demo.gif",
    "/colophon/mcp-demo-still.png",
  ]) {
    const response = await request.get(asset);
    expect(response.status()).toBe(200);
  }
});

test("copying the connect command puts it on the clipboard", async ({
  page,
  context,
  browserName,
}) => {
  test.skip(
    browserName !== "chromium",
    "clipboard permissions are chromium-only",
  );
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/en/colophon");
  await page.getByRole("button", { name: "Copy" }).first().click();
  await expect(page.getByRole("button", { name: "Copied" })).toBeVisible();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  expect(clipboard).toBe(addCommand);
});
