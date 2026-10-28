import { defineConfig, devices } from "@playwright/test";
import { SITES } from "./tests/e2e/sites";

// Runs against production builds (`pnpm build` first). Each site is served by `astro preview`.
export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "test-results/e2e.json" }]],
  use: {
    ...devices["Desktop Chrome"],
    trace: "retain-on-failure",
  },
  webServer: [...SITES, { name: "studio", port: 4324 }].map((s) => ({
    command: `pnpm --dir sites/${s.name} preview`,
    port: s.port,
    reuseExistingServer: true,
    timeout: 60_000,
    env: { ASTRO_TELEMETRY_DISABLED: "1" },
  })),
});
