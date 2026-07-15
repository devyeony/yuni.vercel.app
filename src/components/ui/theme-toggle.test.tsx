import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it } from "vitest";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import en from "../../../messages/en.json";

function renderToggle() {
  return render(
    <NextIntlClientProvider locale="en" messages={en}>
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    </NextIntlClientProvider>,
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("light", "dark");
  });

  it("flips the theme class on <html>", async () => {
    renderToggle();
    const button = await screen.findByRole("button", {
      name: "Switch to light theme",
    });
    await userEvent.click(button);
    expect(document.documentElement).toHaveClass("light");
    await userEvent.click(
      screen.getByRole("button", { name: "Switch to dark theme" }),
    );
    expect(document.documentElement).toHaveClass("dark");
  });
});
