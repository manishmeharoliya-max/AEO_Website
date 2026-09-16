import { test, expect } from '@playwright/test';

test('hero gradient text remains visible on desktop and mobile', async ({
  page,
}, testInfo) => {
  await page.clock.install();
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page.clock.runFor(3000);

    const heading = page.getByRole('heading', { level: 1 });
    const highlight = heading.locator('.bg-clip-text').first();
    await expect(heading).toBeVisible();
    await expect(highlight).toBeVisible();

    // A background shorthand can reset text clipping and make transparent text disappear.
    const style = await highlight.evaluate((element) => {
      const computed = getComputedStyle(element);
      return {
        backgroundClip: computed.backgroundClip,
        backgroundImage: computed.backgroundImage,
        textFill: computed.webkitTextFillColor,
      };
    });
    expect(style.backgroundClip).toBe('text');
    expect(style.backgroundImage).toContain('linear-gradient');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBe(true);
    await page
      .locator('main section').first()
      .screenshot({ path: testInfo.outputPath(`hero-${width}.png`), animations: 'disabled' });
  }

  await page
    .getByRole('link', { name: 'Check Your Free AEO Score', exact: true })
    .click();
  await expect(page.locator('#aeo-checker')).toBeInViewport();
});
