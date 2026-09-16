import { test, expect } from '@playwright/test';
const customer = { id: 1, name: 'Alex Morgan', email: 'alex@example.com', role: 'user' };
const order = {
  id: 42,
  user_id: 1,
  name: customer.name,
  email: customer.email,
  plan_name: 'Growth',
  amount: 499,
  billing: 'monthly',
  status: 'pending',
  created_at: '2026-09-16T10:00:00Z',
};
async function mock(page, role = 'user') {
  const user = { ...customer, role };
  await page.route(url => url.pathname.startsWith('/api/'), (route) => {
    const path = new URL(route.request().url()).pathname;
    if (path === '/api/auth/login')
      return route.fulfill({ json: { token: 'test-session', user } });
    if (path === '/api/auth/me') return route.fulfill({ json: user });
    if (path === '/api/inquiries') return route.fulfill({ json: [{ id: 7, type: 'audit', details: { name: 'Sample lead', email: 'lead@example.com', website: 'https://example.com' }, created_at: order.created_at }] });
    if (path.startsWith('/api/dashboard/'))
      return route.fulfill({
        json: {
          users: [
            customer,
            { id: 2, name: 'Team lead', email: 'team@example.com', role: 'admin' },
          ],
          orders: [order],
        },
      });
    if (path === '/api/orders') return route.fulfill({ status: 201, json: { order } });
    return route.fulfill({ status: 404, json: { message: 'Not found' } });
  });
}
test('public plans remain open; purchase resumes after login and creates pending order', async ({
  page,
}) => {
  await mock(page);
  await page.goto('/plans');
  await page.getByRole('link', { name: 'Choose Growth' }).click();
  await expect(page).toHaveURL(/login\?next=/);
  await page.getByLabel('Email address').fill(customer.email);
  await page.getByLabel('Password', { exact: true }).fill('password123');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page).toHaveURL(/checkout\?plan=growth/);
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Submit plan order' }).click();
  await expect(
    page.getByRole('heading', { name: 'Your order is received.' }),
  ).toBeVisible();
  await expect(page.getByText('Pending payment', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'View my orders' }).click();
  await expect(page).toHaveURL(/account$/);
  await expect(page.getByRole('cell', { name: 'Growth', exact: true })).toBeVisible();
});
for (const role of ['admin', 'superadmin'])
  test(`${role} dashboard, directory and responsive layout`, async ({ page }) => {
    await mock(page, role);
    await page.addInitScript(() =>
      sessionStorage.setItem('zepfly-token', 'test-session'),
    );
    await page.goto(`/${role}`);
    await expect(
      page.getByRole('heading', { name: 'A clear view. A stronger strategy.' }),
    ).toBeVisible();
    await page.screenshot({ path: `test-results/${role}-desktop.png`, fullPage: true });
    await page.getByRole('button', { name: 'Client directory', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${role}/clients$`));
    await page.reload();
    await page.getByRole('textbox', { name: 'Search records' }).fill('alex');
    await expect(
      page.getByRole('cell', { name: customer.email, exact: true }),
    ).toBeVisible();
    await page.getByRole('button', { name: 'Manage', exact: true }).click();
    await expect(
      page.getByRole('heading', { name: `Manage ${customer.name}` }),
    ).toBeVisible();
    await expect(page.getByLabel('Access level')).toHaveCount(
      role === 'superadmin' ? 1 : 0,
    );
    await page.getByRole('button', { name: 'Inquiries', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Sample lead' })).toBeVisible();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('button', { name: 'Overview', exact: true }).click();
    await page.screenshot({ path: `test-results/${role}-mobile.png`, fullPage: true });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    ).toBe(true);
  });
test('customer cannot open staff workspace; expired sessions return to login', async ({
  page,
}) => {
  await mock(page);
  await page.addInitScript(() => sessionStorage.setItem('zepfly-token', 'test-session'));
  await page.goto('/superadmin');
  await expect(page).toHaveURL(/account$/);
  await expect(page.getByRole('cell', { name: 'Growth', exact: true })).toBeVisible();
  await page.route('**/api/dashboard/user', (route) =>
    route.fulfill({ status: 401, json: { message: 'Session expired' } }),
  );
  await page.getByRole('button', { name: 'Refresh data' }).click();
  await expect(page).toHaveURL(/login/);
});

test('navbar icon switches between login and logout on desktop and mobile', async ({ page }) => {
  await mock(page);
  await page.goto('/');
  const login = page.getByRole('button', { name: 'Log in', exact: true });
  await expect(login).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(login).toBeVisible();
  await login.click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByLabel('Email address').fill(customer.email);
  await page.getByLabel('Password', { exact: true }).fill('password123');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.goto('/');
  const logout = page.getByRole('button', { name: 'Log out', exact: true });
  await expect(logout).toBeVisible();
  await expect(login).toHaveCount(0);
  await logout.click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(login).toBeVisible();
});

for (const role of ['user', 'admin', 'superadmin']) {
  test(`${role} sign-in uses the correct role route`, async ({ page }) => {
    await mock(page, role);
    await page.goto('/login?next=https://untrusted.example');
    await page.getByLabel('Email address').fill(customer.email);
    await page.getByLabel('Password', { exact: true }).fill('password123');
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${role === 'user' ? 'account' : role}$`));
    await page.goto(role === 'superadmin' ? '/admin' : '/superadmin/team');
    await expect(page).toHaveURL(new RegExp(`/${role === 'user' ? 'account' : role}$`));
  });
}
