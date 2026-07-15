import { expect, test } from "@playwright/test";

const locales = ["en", "ko"] as const;

test("root redirects to the default locale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
});

for (const locale of locales) {
  test.describe(`/${locale}`, () => {
    test("renders with the correct lang attribute", async ({ page }) => {
      await page.goto(`/${locale}`);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(page.locator("h1")).toBeVisible();
    });

    for (const path of ["", "/design"]) {
      test(`/${locale}${path} has no horizontal overflow`, async ({ page }) => {
        await page.goto(`/${locale}${path}`);
        const overflow = await page.evaluate(() => {
          const el = document.scrollingElement;
          return el ? el.scrollWidth - el.clientWidth : 0;
        });
        expect(overflow).toBe(0);
      });
    }
  });
}
