import { expect, test } from "@playwright/test";

/*
 * SEO surface: JSON-LD identity, per-page Open Graph images, and the
 * sitemap/robots pair. Everything asserted here is generated at build time.
 */

const locales = ["en", "ko"] as const;

for (const locale of locales) {
  const prefix = locale === "en" ? "" : `/${locale}`;

  test.describe(`/${locale} structured data`, () => {
    test("serves Person JSON-LD with the site identity", async ({ page }) => {
      await page.goto(prefix || "/");
      const raw = await page
        .locator('script[type="application/ld+json"]')
        .textContent();
      expect(raw).toBeTruthy();
      const graph = JSON.parse(raw as string)["@graph"] as Array<
        Record<string, unknown>
      >;
      const person = graph.find((node) => node["@type"] === "Person");
      expect(person).toMatchObject({
        name: "Yeonhee Hayden Kim",
        jobTitle: "Software Engineer",
        url: "https://yuni.vercel.app",
      });
      expect(person?.sameAs).toContain("https://github.com/devyeony");
      const website = graph.find((node) => node["@type"] === "WebSite");
      expect(website).toBeTruthy();
    });

    test("every page advertises a locale-scoped OG image that resolves", async ({
      page,
      request,
    }) => {
      for (const path of ["", "/about", "/blog/case-study-schema"]) {
        await page.goto(`${prefix}${path}` || "/");
        const content = await page
          .locator('meta[property="og:image"]')
          .getAttribute("content");
        expect(content, path).toContain(`/${locale}${path}/opengraph-image`);
        const image = await request.get(new URL(content as string).pathname);
        expect(image.status(), path).toBe(200);
        expect(image.headers()["content-type"]).toBe("image/png");
      }
    });

    test("home requests a large summary card", async ({ page }) => {
      await page.goto(prefix || "/");
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        "content",
        "summary_large_image",
      );
    });
  });
}

test("robots.txt allows crawling and points at the sitemap", async ({
  request,
}) => {
  const response = await request.get("/robots.txt");
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain("Allow: /");
  expect(body).toContain("Disallow: /api/");
  expect(body).toContain("Sitemap: https://yuni.vercel.app/sitemap.xml");
});

test("sitemap covers content routes and every URL resolves", async ({
  request,
}) => {
  const response = await request.get("/sitemap.xml");
  expect(response.status()).toBe(200);
  const xml = await response.text();
  expect(xml).toContain("https://yuni.vercel.app/projects/petping");
  expect(xml).toContain("https://yuni.vercel.app/blog/case-study-schema");
  expect(xml).toContain('hreflang="ko"');

  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1] as string,
  );
  expect(urls.length).toBeGreaterThan(5);
  for (const url of urls) {
    const page = await request.get(new URL(url).pathname);
    expect(page.status(), url).toBe(200);
  }
});
