import { expect, test } from "@playwright/test";

/*
 * The contact page is deliberately formless (ADR-0005): three purpose rows,
 * each a mailto link with a locale-appropriate prefilled subject.
 */

for (const { prefix, writeCta, subjects } of [
  {
    prefix: "/en",
    writeCta: "Write to me",
    subjects: ["Hiring", "Collaboration", "Coffee%20chat"],
  },
  {
    prefix: "/ko",
    writeCta: "메일 쓰기",
    subjects: [
      encodeURIComponent("채용 문의"),
      encodeURIComponent("협업 제안"),
      encodeURIComponent("커피챗"),
    ],
  },
]) {
  test(`${prefix}/contact offers purpose-framed mailto CTAs`, async ({
    page,
  }) => {
    await page.goto(`${prefix}/contact`);
    const ctas = page.getByRole("link", { name: new RegExp(writeCta) });
    await expect(ctas).toHaveCount(3);
    for (const [index, subject] of subjects.entries()) {
      await expect(ctas.nth(index)).toHaveAttribute(
        "href",
        new RegExp(`^mailto:.+subject=${subject}`),
      );
    }
  });
}
