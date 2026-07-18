import { expect, test } from "@playwright/test";

const locales = ["en", "ko"] as const;

test("root renders the default locale without a locale prefix", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("/en redirects to the prefix-less default locale", async ({ page }) => {
  await page.goto("/en");
  await expect(page).toHaveURL(/\/$/);
});

for (const locale of locales) {
  test.describe(`/${locale}`, () => {
    const prefix = locale === "en" ? "" : `/${locale}`;

    test("renders with the correct lang attribute", async ({ page }) => {
      await page.goto(prefix || "/");
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("h1")).toBeVisible();
    });

    for (const path of [
      "",
      "/about",
      "/design",
      "/projects",
      "/projects/petping",
    ]) {
      test(`${prefix}${path} has no horizontal overflow`, async ({ page }) => {
        await page.goto(`${prefix}${path}` || "/");
        const overflow = await page.evaluate(() => {
          const el = document.scrollingElement;
          return el ? el.scrollWidth - el.clientWidth : 0;
        });
        expect(overflow).toBe(0);
      });
    }
  });
}
