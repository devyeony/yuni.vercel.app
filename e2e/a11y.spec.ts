import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = [
  "/en",
  "/ko",
  "/en/about",
  "/ko/about",
  "/en/design",
  "/ko/design",
  "/en/projects",
  "/ko/projects",
  "/en/projects/petping",
  "/ko/projects/petping",
  "/en/blog",
  "/ko/blog",
  "/en/blog/case-study-schema",
  "/ko/blog/case-study-schema",
  "/en/embeddings",
  "/ko/embeddings",
];

async function scan(page: import("@playwright/test").Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  return results.violations;
}

for (const path of pages) {
  test(`${path} has no WCAG A/AA violations`, async ({ page }) => {
    await page.goto(path);
    expect(await scan(page)).toEqual([]);
  });
}

test("/en/design has no violations in the light theme", async ({ page }) => {
  await page.goto("/en/design");
  await page
    .getByRole("button", { name: "Switch to light theme" })
    .first()
    .click();
  await expect(page.locator("html")).toHaveClass(/light/);
  expect(await scan(page)).toEqual([]);
});
