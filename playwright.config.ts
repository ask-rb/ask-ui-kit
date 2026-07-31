import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 10000,
  retries: 0,
  use: {
    baseURL: "http://localhost:4173",
    browserName: "chromium",
    headless: true,
  },
  webServer: {
    command: "node serve-tests.mjs",
    port: 4173,
    reuseExistingServer: true,
  },
});
