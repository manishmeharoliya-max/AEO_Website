import { test, expect } from '@playwright/test';
import { routes } from '../src/config/routes.js';
import { articles } from '../src/data/insights.js';
test('every route renders with metadata, one heading and no browser errors', async ({
  page,
}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  for (const path of [
    ...routes,
    ...articles.map((a) => `/insights/${a.slug}`),
    '/missing-page',
    '/insights/missing-article',
  ]) {
    await page.goto(path);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).not.toBeEmpty();
    await expect(page).toHaveTitle(/AnswerEdge/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /.+/,
    );
  }
  expect(errors).toEqual([]);
});
test('homepage links, FAQ and service anchors work', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Enquire on WhatsApp' })).toHaveAttribute(
    'href',
    /^https:\/\/wa\.me\/917073388830\?text=/,
  );
  await page
    .getByRole('button', { name: 'Can AEO guarantee visibility in ChatGPT?' })
    .click();
  await expect(
    page.getByText('No. No company can guarantee', { exact: false }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Can AEO guarantee visibility in ChatGPT?' })
    .click();
  await expect(
    page.getByText('No. No company can guarantee', { exact: false }),
  ).toBeHidden();
  const hrefs = await page
    .locator('a[href^="/"]')
    .evaluateAll((links) => links.map((a) => a.getAttribute('href')));
  for (const href of new Set(hrefs)) {
    await page.goto(href);
    await expect(
      page.getByRole('heading', { name: 'This answer isn’t here.' }),
    ).toHaveCount(0);
    if (href.includes('#'))
      await expect(page.locator('#' + href.split('#')[1])).toBeInViewport();
  }
});
test('insight filters and article previews work', async ({ page }) => {
  await page.goto('/insights');
  await page.getByRole('button', { name: 'Technical AEO', exact: true }).click();
  await expect(page.locator('.blog-card')).toHaveCount(2);
  await expect(page.getByRole('status')).toContainText('2 insights');
  await page.locator('.blog-card').first().click();
  await expect(
    page.getByRole('heading', { name: 'This insight is being prepared' }),
  ).toBeVisible();
});
test('audit validates fields and saves through the inquiry API', async ({ page }) => {
  await page.route('**/api/inquiries', route => route.fulfill({ status: 201, json: { id: 1 } }));
  const submissions = [];
  page.on('request', (r) => {
    if (r.method() === 'POST') submissions.push(r.url());
  });
  await page.goto('/aeo-audit');
  await page
    .getByRole('button', { name: 'Request My AEO Analysis', exact: true })
    .click();
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(7);
  await page.getByLabel('Full Name').fill('Alex Sample');
  await page.getByLabel('Business Email').fill('invalid');
  await page.getByLabel('Company Name').fill('Example Company');
  await page.getByLabel('Website URL').fill('javascript:bad');
  await page.getByLabel('Target Country').fill('United Kingdom');
  await page.getByLabel('Industry', { exact: false }).selectOption('SaaS and Technology');
  await page.getByLabel('Main Service').fill('Project management software');
  await page
    .getByRole('button', { name: 'Request My AEO Analysis', exact: true })
    .click();
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(2);
  await page.getByLabel('Business Email').fill('alex@example.com');
  await page.getByLabel('Website URL').fill('https://example.com');
  await page
    .getByRole('button', { name: 'Request My AEO Analysis', exact: true })
    .click();
  await expect(page.getByRole('status')).toContainText(
    'Your audit request has been received',
  );
  expect(submissions).toHaveLength(1);
  expect(submissions[0]).toContain('/api/inquiries');
  await page.reload();
  await expect(page.getByLabel('Full Name')).toHaveValue('');
});
test('contact validates and confirms only after saving', async ({ page }) => {
  await page.route('**/api/inquiries', route => route.fulfill({ status: 201, json: { id: 2 } }));
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(4);
  await page.getByLabel('Name', { exact: false }).fill('Alex Sample');
  await page.getByLabel('Business Email').fill('alex@example.com');
  await page.getByLabel('Required Service').selectOption('AEO Website Audit');
  await page
    .getByLabel('Message', { exact: false })
    .fill('Please review our product pages.');
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.getByRole('status')).toContainText('Your message has been received');
  await page.getByRole('button', { name: 'Submit another message' }).click();
  await expect(page.getByLabel('Name', { exact: false })).toHaveValue('');
});
test('mobile navigation, tablet and desktop layouts fit the viewport', async ({
  page,
}, testInfo) => {
  test.setTimeout(120000);
  for (const width of [360, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of routes) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${path} at ${width}px`,
      ).toBe(true);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await page
    .getByRole('navigation', { name: 'Mobile navigation' })
    .getByRole('link', { name: 'Services', exact: true })
    .click();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toHaveCount(
    0,
  );
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toHaveCount(
    0,
  );
  await page.goto('/');
  await page.screenshot({ path: testInfo.outputPath('home-mobile.png'), fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: testInfo.outputPath('home-desktop.png'),
    fullPage: true,
  });
  await page.screenshot({ path: testInfo.outputPath('home-desktop-viewport.png') });
});
