import { existsSync } from "node:fs";
import { expect, test } from "@playwright/test";

/*
 * Visual regression for the /design showcase — the design system's canary.
 * Baselines are per-platform (Playwright default); a platform without
 * committed baselines skips instead of failing, and `pnpm exec playwright
 * test --update-snapshots` regenerates them (see agents/skills/verify).
 */
const themes = ["dark", "light"] as const;

for (const theme of themes) {
  test(`design showcase — ${theme}`, async ({ page }, testInfo) => {
    const snapshot = `design-${theme}.png`;
    test.skip(
      !!process.env.CI && !existsSync(testInfo.snapshotPath(snapshot)),
      "no visual baseline committed for this platform",
    );

    await page.goto("/en/design");
    if (theme === "light") {
      await page
        .getByRole("button", { name: "Switch to light theme" })
        .first()
        .click();
      await expect(page.locator("html")).toHaveClass(/light/);
    }
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(snapshot, { fullPage: true });
  });
}
