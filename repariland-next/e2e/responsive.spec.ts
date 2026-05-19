import { test, expect, type Page } from '@playwright/test';

const SCREENS = ['inicio', 'historia', 'servicios', 'noticias', 'contacto'] as const;

async function waitForAppReady(page: Page) {
  await page.goto('/');
  await page.waitForSelector('[data-app-dock]', { state: 'attached', timeout: 60_000 });
  await page.waitForSelector('[data-app-ready]', { state: 'attached', timeout: 30_000 });
  await page.waitForTimeout(800);
}

const TAB_LABELS: Record<(typeof SCREENS)[number], RegExp> = {
  inicio: /inicio/i,
  historia: /historia/i,
  servicios: /servicios/i,
  noticias: /noticias/i,
  contacto: /contacto/i,
};

async function navigateTo(page: Page, screen: (typeof SCREENS)[number]) {
  const tab = page.getByRole('tab', { name: TAB_LABELS[screen] });
  await tab.waitFor({ state: 'visible', timeout: 15_000 });
  await tab.dispatchEvent('pointerdown');
  await page.waitForTimeout(700);
}

test.describe('responsive screens', () => {
  test.beforeEach(async ({ page }) => {
    await waitForAppReady(page);
  });

  for (const screen of SCREENS) {
    test(`screen: ${screen}`, async ({ page }, testInfo) => {
      await navigateTo(page, screen);
      await expect(page.locator('[data-app-dock]')).toBeVisible();
      await expect(page).toHaveScreenshot(`screen-${screen}.png`, {
        fullPage: false,
        maxDiffPixelRatio: testInfo.project.name.includes('iphone') ? 0.04 : 0.02,
      });
    });
  }

  test('servicios: quote modal', async ({ page }, testInfo) => {
    await navigateTo(page, 'servicios');
    const quoteBtn = page.getByRole('button', { name: /cotizar/i }).first();
    await quoteBtn.click();
    await page.waitForTimeout(400);
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page).toHaveScreenshot('modal-quote.png', {
      maxDiffPixelRatio: testInfo.project.name.includes('iphone') ? 0.05 : 0.03,
    });
  });

  test('contacto: message modal on mobile', async ({ page }, testInfo) => {
    await navigateTo(page, 'contacto');
    const isMobile = testInfo.project.name.includes('iphone') || testInfo.project.name === 'ipad-portrait';
    if (!isMobile) {
      test.skip();
      return;
    }
    const msgBtn = page.getByRole('button', { name: /^enviar mensaje$/i });
    if (await msgBtn.isVisible()) {
      await msgBtn.dispatchEvent('pointerdown');
      await page.waitForTimeout(400);
      await expect(page.getByRole('dialog')).toBeVisible();
      await expect(page).toHaveScreenshot('modal-contact.png', {
        maxDiffPixelRatio: 0.05,
      });
    }
  });
});
