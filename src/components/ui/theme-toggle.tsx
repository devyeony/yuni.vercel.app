"use client";

import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13.5 9.5a5.5 5.5 0 0 1-7-7 6 6 0 1 0 7 7Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
    >
      <circle cx="8" cy="8" r="3.25" />
      <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M12.6 3.4l-1 1M4.4 11.6l-1 1" />
    </svg>
  );
}

export function ThemeToggle() {
  const t = useTranslations("ui.themeToggle");
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Theme is unknowable on the server; render a neutral placeholder until
  // mounted to avoid a hydration mismatch.
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const label = mounted ? t(isDark ? "toLight" : "toDark") : t("toLight");

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {mounted ? isDark ? <SunIcon /> : <MoonIcon /> : <MoonIcon />}
    </Button>
  );
}
