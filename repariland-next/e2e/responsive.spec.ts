import { test, expect, type Page } from '@playwright/test';

const SCREENS = ['inicio', 'historia', 'servicios', 'noticias', 'reels', 'contacto'] as const;

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
  reels: /reels/i,
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

  test('reels: empty feed visible', async ({ page }) => {
    await navigateTo(page, 'reels');
    await expect(page.getByText(/REELS/i).first()).toBeVisible();
    await expect(page.locator('[data-screen="reels"]')).toBeVisible();
  });

  test('contacto: message form on mobile', async ({ page }, testInfo) => {
    await navigateTo(page, 'contacto');
    const isMobile = testInfo.project.name.includes('iphone') || testInfo.project.name === 'ipad-portrait';
    if (!isMobile) {
      test.skip();
      return;
    }
    await expect(page.getByRole('link', { name: /whatsapp/i })).toBeVisible();
    const msgBtn = page.getByRole('button', { name: /^mensaje$/i });
    await expect(msgBtn).toBeVisible();
    await msgBtn.click();
    await expect(page.getByRole('button', { name: /regresar a contacto/i })).toBeVisible();
    await expect(page.getByLabel('Nombre')).toBeVisible();
    await expect(page.getByRole('button', { name: /^enviar mensaje$/i })).toBeVisible();
  });
});
