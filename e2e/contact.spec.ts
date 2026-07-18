import { expect, test } from "@playwright/test";

/*
 * Contact form behavior. Rendering is asserted per locale; server-action
 * round trips are scoped to the desktop project so the shared per-instance
 * rate-limit window (keyed "local" without x-forwarded-for) stays well under
 * its limit across the suite.
 */

test.describe("contact page", () => {
  for (const { prefix, labels } of [
    {
      prefix: "/en",
      labels: { name: "Name", message: "Message", submit: "Send message" },
    },
    {
      prefix: "/ko",
      labels: { name: "이름", message: "메시지", submit: "메시지 보내기" },
    },
  ]) {
    test(`${prefix}/contact renders the form with purpose choices`, async ({
      page,
    }) => {
      await page.goto(`${prefix}/contact`);
      await expect(page.getByLabel(labels.name)).toBeVisible();
      await expect(page.getByLabel(labels.message)).toBeVisible();
      await expect(page.getByRole("radio").nth(0)).toBeChecked();
      expect(await page.getByRole("radio").count()).toBe(3);
      await expect(
        page.getByRole("button", { name: labels.submit }),
      ).toBeVisible();
    });
  }
});

test.describe("contact form submission", () => {
  // Desktop project only (the phone/tablet projects emulate mobile devices):
  // server-action round trips run once, not per viewport.
  test.skip(({ isMobile }) => isMobile, "desktop project only");

  test("reports honest failure with a direct-email fallback when delivery is unconfigured", async ({
    page,
  }) => {
    await page.goto("/en/contact");
    await page.getByLabel("Name").fill("Playwright Smoke");
    await page.getByLabel("Email").fill("smoke@example.com");
    await page
      .getByLabel("Message")
      .fill("End-to-end submission without a delivery key configured.");
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(
      page.getByText("The form couldn't send your message right now."),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Email me directly" }),
    ).toHaveAttribute("href", /^mailto:/);
  });

  test("server-side validation reports fields when HTML validation is bypassed", async ({
    page,
  }) => {
    await page.goto("/en/contact");
    // Disable the browser's constraint validation to exercise the Zod
    // boundary in the server action itself.
    await page.$eval("form", (form) => {
      (form as HTMLFormElement).noValidate = true;
    });
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByText("Please tell me your name.")).toBeVisible();
    await expect(
      page.getByText("That email address doesn't look right."),
    ).toBeVisible();
    await expect(
      page.getByText("A little more detail helps — at least 10 characters."),
    ).toBeVisible();
    // Purpose has a default selection, so it stays valid even here.
    await expect(page.getByRole("radio").nth(0)).toBeChecked();
  });
});
