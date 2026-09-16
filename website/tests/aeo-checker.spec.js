import { test, expect } from '@playwright/test';

const result = {
  url: 'https://example.com/',
  score: 35,
  level: 'Needs attention',
  limitations:
    'A rules-based check of one page’s initial HTML, not a platform-issued AEO score or a prediction of AI citations.',
  checks: [
    {
      id: 'https',
      label: 'Secure page delivery',
      maxPoints: 5,
      points: 5,
      passed: true,
      evidence: 'Final page uses HTTPS.',
    },
    {
      id: 'schema',
      label: 'Machine-readable context',
      maxPoints: 15,
      points: 0,
      passed: false,
      evidence: 'No JSON-LD found.',
      reason: 'No parseable JSON-LD context was detected.',
      recommendation: 'Add appropriate structured data that matches visible content.',
    },
  ],
};

test('checker validates, displays score and reasons, and carries a USD plan to login', async ({
  page,
}) => {
  await page.route('**/api/aeo/analyze', async (route) => {
    expect(route.request().postDataJSON()).toEqual({ url: 'https://example.com/' });
    await route.fulfill({ json: result });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Check My AEO Score' }).click();
  await expect(page.getByRole('alert')).toContainText('Enter your website URL');
  await page.getByLabel('Your website URL', { exact: true }).fill('example.com');
  await page.getByRole('button', { name: 'Check My AEO Score' }).click();
  await expect(page.getByLabel('AEO readiness score 35 out of 100')).toBeVisible();
  await expect(
    page.getByText('No parseable JSON-LD context was detected.'),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Turn your findings into a plan.' }),
  ).toBeVisible();
  await expect(page.locator('.plan-card')).toHaveCount(3);
  await expect(page.locator('.plan-price').nth(0)).toContainText('$199');
  await expect(page.locator('.plan-price').nth(1)).toContainText('$499');
  await expect(page.locator('.plan-price').nth(2)).toContainText('$999');
  await page.getByText('See all checks and score breakdown').click();
  await expect(page.locator('.check-result')).toHaveCount(2);
  await page.getByRole('link', { name: 'Choose Growth' }).click();
  await expect(page).toHaveURL(/login\?next=/);
  expect(new URL(page.url()).searchParams.get('next')).toContain('/checkout?plan=growth');
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
});

test('server errors never show a fake score or plans and users can retry', async ({
  page,
}) => {
  await page.route('**/api/aeo/analyze', (route) =>
    route.fulfill({
      status: 422,
      json: { message: 'The website blocks automated checks.' },
    }),
  );
  await page.goto('/');
  await page.getByLabel('Your website URL', { exact: true }).fill('example.com');
  await page.getByRole('button', { name: 'Check My AEO Score' }).click();
  await expect(page.getByRole('alert')).toHaveText(
    'The website blocks automated checks.',
  );
  await expect(page.locator('.score-ring')).toHaveCount(0);
  await expect(page.locator('.plan-card')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Check My AEO Score' })).toBeEnabled();
});

test('new checks clear old results and mobile results fit the screen', async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.route('**/api/aeo/analyze', (route) => route.fulfill({ json: result }));
  await page.goto('/');
  await page.getByLabel('Your website URL', { exact: true }).fill('example.com');
  await page.getByRole('button', { name: 'Check My AEO Score' }).click();
  await expect(page.locator('.plan-card')).toHaveCount(3);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  ).toBe(true);
  await page.unroute('**/api/aeo/analyze');
  await page.route('**/api/aeo/analyze', (route) =>
    route.fulfill({ status: 429, json: { message: 'Try again in one minute.' } }),
  );
  await page.getByRole('button', { name: 'Check My AEO Score' }).click();
  await expect(page.getByRole('alert')).toContainText('one minute');
  await expect(page.locator('.score-ring')).toHaveCount(0);
});

test('pending plan order shows a clearly labeled possible score and rescan link', async ({
  page,
}) => {
  await page.addInitScript(() => sessionStorage.setItem('zepfly-token', 'test-session'));
  await page.route('**/api/auth/me', (route) =>
    route.fulfill({
      json: { id: 1, name: 'Client', email: 'client@example.com', role: 'user' },
    }),
  );
  await page.route('**/api/orders', (route) =>
    route.fulfill({ status: 201, json: { order: { id: 42, status: 'pending' } } }),
  );
  await page.route('**/api/aeo/analyze', (route) => route.fulfill({ json: result }));
  await page.goto('/checkout?plan=growth&website=https%3A%2F%2Fexample.com%2F');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Submit plan order' }).click();
  await expect(
    page.getByRole('heading', { name: 'Illustrative improvement scenario' }),
  ).toBeVisible();
  await expect(page.getByText('Current measured score:')).toContainText('35/100');
  await expect(page.getByText('This is an estimate', { exact: false })).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Rescan after the fixes are live' }),
  ).toHaveAttribute('href', /website=https%3A%2F%2Fexample\.com/);
});
