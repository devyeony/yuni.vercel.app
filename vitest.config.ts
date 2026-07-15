import { defineConfig } from "vitest/config";

// e2e/ belongs to Playwright (`pnpm verify`); Vitest owns unit/component tests.
export default defineConfig({
  test: {
    include: ["src/**/*.test.{ts,tsx}"],
    passWithNoTests: true,
  },
});
