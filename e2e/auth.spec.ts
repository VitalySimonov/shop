import { expect, test } from '@playwright/test';
import { mockApiHappyPath } from './mockApi';

test('Guard/Redirect: unauthenticated /products redirects to /login', async ({ page }) => {
  await page.goto('/products');
  await expect(page).toHaveURL(/\/login\b/);
  await expect(page.getByRole('button', { name: 'Войти' })).toBeVisible();
});

test('Happy path: login -> products table is visible', async ({ page }) => {
  await mockApiHappyPath(page);

  await page.goto('/login');

  await page.locator('input[name="username"]').fill('emilys');
  await page.locator('input[name="password"]').fill('emilyspass');
  await page.getByRole('button', { name: 'Войти' }).click();

  await expect(page).toHaveURL(/\/products\b/);
  await expect(page.getByText('iPhone 9')).toBeVisible();
});
