import { defineConfig } from '@playwright/test';

const PORT = process.env.PLAYWRIGHT_PORT ?? '3012';
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  timeout: 90_000,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    },
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    colorScheme: 'dark',
  },
  webServer: {
    command: `npm run dev -- -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'iphone-14', use: { viewport: { width: 390, height: 844 } } },
    { name: 'iphone-pro-max', use: { viewport: { width: 430, height: 932 } } },
    { name: 'ipad-portrait', use: { viewport: { width: 768, height: 1024 } } },
    { name: 'laptop', use: { viewport: { width: 1280, height: 800 } } },
    { name: 'design-ref', use: { viewport: { width: 1920, height: 1080 } } },
    { name: 'ultrawide', use: { viewport: { width: 2560, height: 1440 } } },
  ],
});
