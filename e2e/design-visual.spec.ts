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

    if (theme === "light") {
      // Seed next-themes directly: clicking the toggle would race hydration
      // on slow runners, and toggle behavior is covered elsewhere.
      await page.addInitScript(() => localStorage.setItem("theme", "light"));
    }
    await page.goto("/en/design");
    await expect(page.locator("html")).toHaveClass(new RegExp(theme));
    await page.evaluate(() => document.fonts.ready);
    await expect(page).toHaveScreenshot(snapshot, {
      fullPage: true,
      // Full-page capture can exceed the default 5s on emulated/slow CI.
      timeout: 30_000,
    });
  });
}
