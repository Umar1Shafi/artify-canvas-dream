// tests/e2e/playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./specs",
  timeout: 60 * 1000,
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://localhost:5173",
    trace: "on-first-retry",
  },
  reporter: [["list"], ["html", { outputFolder: "playwright-report", open: "never" }]],
});