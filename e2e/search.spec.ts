import { expect, test } from "@playwright/test";

/*
 * Site search smoke: static hybrid engine over the served rag-index.json —
 * lexical matches plus embedding-space neighbors, in both locales.
 */

const cases = [
  {
    locale: "en",
    path: "/",
    openLabel: "Search",
    boxLabel: "Search this site",
    query: "insurance",
    resultHref: "/projects/petping",
    nearbyHeading: "Nearby in embedding space",
  },
  {
    locale: "ko",
    path: "/ko",
    openLabel: "검색",
    boxLabel: "사이트 검색",
    query: "오픈소스",
    resultHref: "/ko/about",
    nearbyHeading: "임베딩 공간의 이웃",
  },
] as const;

for (const c of cases) {
  test(`${c.locale}: search finds matches and embedding-space neighbors`, async ({
    page,
  }) => {
    await page.goto(c.path);
    await page.getByRole("button", { name: c.openLabel }).click();
    await page.getByRole("searchbox", { name: c.boxLabel }).fill(c.query);

    const dialog = page.getByRole("dialog");
    await expect(
      dialog.locator(`a[href="${c.resultHref}"]`).first(),
    ).toBeVisible();
    // The semantic half is visible mechanism: neighbors carry a cosine score.
    await expect(dialog.getByText(c.nearbyHeading)).toBeVisible();
  });
}

test("keyboard shortcut opens search and Escape closes it", async ({
  page,
}) => {
  await page.goto("/");
  const box = page.getByRole("searchbox", { name: "Search this site" });
  // The chord listener attaches on hydration, which load doesn't await —
  // retry the press like a person would instead of racing it.
  await expect(async () => {
    await page.keyboard.press("ControlOrMeta+k");
    await expect(box).toBeVisible({ timeout: 500 });
  }).toPass({ timeout: 10_000 });
  await page.keyboard.press("Escape");
  await expect(box).not.toBeVisible();
});

test("unmatched queries report an empty state", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByRole("searchbox", { name: "Search this site" }).fill("xyzzy");
  await expect(
    page.getByRole("dialog").getByText(/Nothing found/),
  ).toBeVisible();
});
