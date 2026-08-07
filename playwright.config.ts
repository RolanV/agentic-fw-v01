import { defineConfig, devices } from '@playwright/test';
/* ConfigOptions import removed */

/**
 * Playwright Test Configuration for the Cline Automation Platform.
 *
 * - Uses Allure reporter (allure-playwright) for rich test reports.
 * - Enables Chromium, Firefox and WebKit browsers.
 * - Auto‑waits are relied upon; no explicit timeouts are added.
 * - Follows .clinerules/playwright.md for selector strategy.
 */
export default defineConfig({
  testDir: 'src/tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  reporter: [['list'], ['allure-playwright']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Browser devices
    ...devices,
  },
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'WebKit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  
});
