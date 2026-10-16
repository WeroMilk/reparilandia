import { test, expect, type Frame, type Page } from '@playwright/test';

const SCREENS = ['inicio', 'historia', 'servicios', 'noticias', 'contacto', 'reels'] as const;

type AppHandle = Page | Frame;

async function resolveApp(page: Page): Promise<AppHandle> {
  await page.goto('/');
  const iframe = page.locator(
    'iframe[name="reparilandia-desktop"], iframe[name="reparilandia-mobile"]',
  );
  const hasFrame = await iframe
    .waitFor({ state: 'attached', timeout: 8_000 })
    .then(() => true)
    .catch(() => false);

  const app: AppHandle = hasFrame
    ? (page.frame({ name: 'reparilandia-desktop' }) ??
      page.frame({ name: 'reparilandia-mobile' }) ??
      page)
    : page;
  await app.waitForSelector('[data-app-dock]', { state: 'attached', timeout: 60_000 });
  await app.waitForSelector('[data-app-ready]', { state: 'attached', timeout: 30_000 });
  await page.waitForTimeout(800);
  return app;
}

const TAB_LABELS: Record<(typeof SCREENS)[number], RegExp> = {
  inicio: /inicio/i,
  historia: /historia/i,
  servicios: /servicios/i,
  noticias: /noticias/i,
  reels: /reels/i,
  contacto: /contacto/i,
};

async function navigateTo(page: AppHandle, screen: (typeof SCREENS)[number]) {
  const tab = page.getByRole('tab', { name: TAB_LABELS[screen] });
  await tab.waitFor({ state: 'visible', timeout: 15_000 });
  await tab.dispatchEvent('pointerdown');
  await page.waitForTimeout(700);
}

test.describe('responsive screens', () => {
  for (const screen of SCREENS) {
    test(`screen: ${screen}`, async ({ page }, testInfo) => {
      const app = await resolveApp(page);
      await navigateTo(app, screen);
      await expect(app.locator('[data-app-dock]')).toBeVisible();
      await expect(page).toHaveScreenshot(`screen-${screen}.png`, {
        fullPage: false,
        maxDiffPixelRatio: testInfo.project.name.includes('iphone') ? 0.04 : 0.02,
      });
    });
  }

  test('servicios: quote modal', async ({ page }, testInfo) => {
    const app = await resolveApp(page);
    await navigateTo(app, 'servicios');
    const quoteBtn = app.getByRole('button', { name: /cotizar/i }).first();
    await quoteBtn.click();
    await page.waitForTimeout(400);
    await expect(app.getByRole('dialog')).toBeVisible();
    await expect(page).toHaveScreenshot('modal-quote.png', {
      maxDiffPixelRatio: testInfo.project.name.includes('iphone') ? 0.05 : 0.03,
    });
  });

  test('reels: empty feed visible', async ({ page }) => {
    const app = await resolveApp(page);
    await navigateTo(app, 'reels');
    await expect(app.getByText(/REELS/i).first()).toBeVisible();
    await expect(app.locator('[data-screen="reels"]')).toBeVisible();
  });

  test('contacto: message form on mobile', async ({ page }, testInfo) => {
    const app = await resolveApp(page);
    await navigateTo(app, 'contacto');
    const isMobile = testInfo.project.name.includes('iphone') || testInfo.project.name === 'ipad-portrait';
    if (!isMobile) {
      test.skip();
      return;
    }
    await expect(app.getByRole('link', { name: /whatsapp/i })).toBeVisible();
    const msgBtn = app.getByRole('button', { name: /enviar mensaje/i });
    await expect(msgBtn).toBeVisible();
    await msgBtn.click();
    await expect(app.getByRole('button', { name: /regresar a contacto/i })).toBeVisible();
    await expect(app.getByLabel('Nombre')).toBeVisible();
    await expect(app.getByRole('button', { name: /^enviar mensaje$/i })).toBeVisible();
  });
});
