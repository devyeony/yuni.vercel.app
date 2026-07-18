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

    test("serves the RAG index with chunks for this locale", async ({
      request,
    }) => {
      const response = await request.get("/rag-index.json");
      expect(response.status()).toBe(200);
      const index = await response.json();
      expect(index.model).toContain("e5");
      expect(
        index.chunks.filter(
          (chunk: { locale: string }) => chunk.locale === locale,
        ).length,
      ).toBeGreaterThan(0);
    });

    test("recommends similar content on detail pages", async ({ page }) => {
      const heading = locale === "en" ? "Similar work" : "비슷한 작업";
      for (const [path, target] of [
        ["/projects/petping", `${prefix}/blog/case-study-schema`],
        ["/blog/case-study-schema", `${prefix}/projects/petping`],
      ] as const) {
        await page.goto(`${prefix}${path}`);
        await expect(
          page.getByRole("heading", { name: heading }),
        ).toBeVisible();
        await expect(page.locator(`a[href="${target}"]`)).toBeVisible();
      }
    });

    test("renders the embedding map with interactive points", async ({
      page,
    }) => {
      await page.goto(`${prefix}/embeddings`);
      const plot = page.getByRole("list", {
        name:
          locale === "en"
            ? "2D map of content embeddings"
            : "콘텐츠 임베딩 2D 지도",
      });
      const points = plot.getByRole("button");
      expect(await points.count()).toBeGreaterThanOrEqual(10);
      await expect(plot.getByRole("button", { pressed: true })).toHaveCount(1);
      const last = points.last();
      await last.click();
      await expect(last).toHaveAttribute("aria-pressed", "true");
    });

    test("serves an RSS feed", async ({ request }) => {
      const response = await request.get(`/${locale}/feed.xml`);
      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toContain(
        "application/rss+xml",
      );
      expect(await response.text()).toContain("<rss");
    });

    for (const path of [
      "",
      "/about",
      "/design",
      "/projects",
      "/projects/petping",
      "/blog",
      "/blog/case-study-schema",
      "/embeddings",
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
