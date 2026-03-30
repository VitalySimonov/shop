import { expect, test } from '@playwright/test';
import { mockApiHappyPath } from './mockApi';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.locator('input[name="username"]').fill('emilys');
  await page.locator('input[name="password"]').fill('emilyspass');
  await page.getByRole('button', { name: 'Войти' }).click();
  await expect(page).toHaveURL(/\/products\b/);
}

test('Search: typing query updates table results', async ({ page }) => {
  await mockApiHappyPath(page);
  await login(page);

  await expect(page.getByText('iPhone 9')).toBeVisible();

  const search = page.getByPlaceholder('Найти');
  await search.fill('mac');
  await search.press('Enter');

  await expect(page.getByText('MacBook Pro')).toBeVisible();
});

test('Sorting: click header changes order (server sort)', async ({ page }) => {
  await mockApiHappyPath(page);
  await login(page);

  await expect(page.getByText('iPhone 9')).toBeVisible();

  await page.getByRole('columnheader', { name: /цена/i }).click();
  await expect(page.getByText('Cheap Item')).toBeVisible();
});

test('Pagination: next page loads different rows', async ({ page }) => {
  await mockApiHappyPath(page);
  await login(page);

  await expect(page.getByText('iPhone 9')).toBeVisible();

  await page.getByRole('button', { name: '2' }).click();
  await expect(page.getByText('Page 2 Item')).toBeVisible();
});
