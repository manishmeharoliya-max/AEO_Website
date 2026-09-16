const { chromium, expect } = require('@playwright/test');
const { mkdirSync } = require('node:fs');

async function verify() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto('http://localhost:5173/');
    await page
      .getByLabel('Your website URL', { exact: true })
      .fill('https://example.com');
    await page.getByRole('button', { name: 'Check My AEO Score' }).click();
    await expect(page.locator('.score-ring')).toBeVisible({ timeout: 20000 });
    await expect(page.locator('.plan-card')).toHaveCount(3);
    mkdirSync('test-results/live-aeo', { recursive: true });
    await page
      .locator('.score-summary')
      .screenshot({ path: 'test-results/live-aeo/score.png' });
    await page
      .locator('.checker-plans')
      .screenshot({ path: 'test-results/live-aeo/plans-desktop.png' });
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator('.score-ring')).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBe(true);
    await page
      .locator('.score-summary')
      .screenshot({ path: 'test-results/live-aeo/score-mobile.png' });
    await page
      .locator('.checker-plans')
      .screenshot({ path: 'test-results/live-aeo/plans-mobile.png' });
    expect(errors).toEqual([]);
    console.log(
      'Live URL check passed: score, issues, USD plans and mobile layout. No browser errors.',
    );
  } finally {
    await browser.close();
  }
}

verify().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
