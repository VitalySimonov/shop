import { expect, test } from '@playwright/test';
import { mockApiHappyPath } from './mockApi';

async function login(page: import('@playwright/test').Page) {
  await page.goto('/login');
  await page.locator('input[name="username"]').fill('emilys');
  await page.locator('input[name="password"]').fill('emilyspass');
  await page.getByRole('button', { name: 'Войти' }).click();
  await expect(page).toHaveURL(/\/products\b/);
}

test('Create product: open form, validate, create, see success', async ({ page }) => {
  await mockApiHappyPath(page);
  await login(page);

  await expect(page.getByText(/все позиции/i)).toBeVisible();

  await page.getByRole('button', { name: /добавить/i }).click();
  await expect(page.getByText('Новый товар')).toBeVisible();

  // validation on empty submit
  await page.getByRole('button', { name: 'Создать' }).click();
  await expect(page.getByText('Введите название')).toBeVisible();

  await page.getByLabel('Название').fill('Created');
  await page.getByLabel('Артикул').fill('SKU-123');
  await page.getByLabel('Цена').fill('123');

  await page.getByLabel('Вендор').click();
  await page.getByRole('option', { name: 'Smartphones' }).click();

  await page.getByRole('button', { name: 'Создать' }).click();
  await expect(page.getByText('Товар успешно создан')).toBeVisible();
});
