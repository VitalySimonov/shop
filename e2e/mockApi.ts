import type { Page } from '@playwright/test';

type IProductsResponse = {
  products: Array<{ id: number; title: string; category: string; price: number; stock: number }>;
  total: number;
  skip: number;
  limit: number;
};

function makeProductsResponse(
  products: IProductsResponse['products'],
  total = products.length,
  skip = 0,
  limit = 20,
): IProductsResponse {
  return { products, total, skip, limit };
}

export async function mockApiHappyPath(page: Page) {
  await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        username: 'emilys',
        email: 'emily.johnson@x.dummyjson.com',
        firstName: 'Emily',
        lastName: 'Johnson',
        gender: 'female',
        image: 'https://dummyjson.com/icon/emilys/128',
        accessToken: 'test-token',
        refreshToken: 'test-refresh-token',
      }),
    });
  });

  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        username: 'emilys',
        email: 'emily.johnson@x.dummyjson.com',
        firstName: 'Emily',
        lastName: 'Johnson',
        gender: 'female',
        image: 'https://dummyjson.com/icon/emilys/128',
      }),
    });
  });

  await page.route('**/api/auth/refresh', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ accessToken: 'test-refreshed-token' }),
    });
  });

  await page.route('**/api/products/category-list', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(['smartphones', 'laptops']),
    });
  });

  await page.route('**/api/products/add', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 999,
        title: 'Created',
        category: 'smartphones',
        price: 123,
        stock: 0,
      }),
    });
  });

  await page.route('**/api/products/search?*', async (route) => {
    const url = new URL(route.request().url());
    const q = (url.searchParams.get('q') ?? '').toLowerCase();
    if (q.includes('mac')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(
          makeProductsResponse(
            [{ id: 10, title: 'MacBook Pro', category: 'laptops', price: 1999, stock: 10 }],
            1,
            0,
            20,
          ),
        ),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(makeProductsResponse([], 0, 0, 20)),
    });
  });

  await page.route('**/api/products?*', async (route) => {
    const url = new URL(route.request().url());
    const skip = Number(url.searchParams.get('skip') ?? 0);
    const limit = Number(url.searchParams.get('limit') ?? 20);
    const sortBy = url.searchParams.get('sortBy');
    const order = url.searchParams.get('order');

    // Pagination: page 2
    if (skip >= limit) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(
          makeProductsResponse(
            [{ id: 2, title: 'Page 2 Item', category: 'misc', price: 10, stock: 1 }],
            40,
            skip,
            limit,
          ),
        ),
      });
      return;
    }

    // Sorting: when user clicks "Цена" header the app sends sortBy=price&order=asc
    if (sortBy === 'price' && order === 'asc') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(
          makeProductsResponse(
            [{ id: 3, title: 'Cheap Item', category: 'misc', price: 1, stock: 1 }],
            1,
            skip,
            limit,
          ),
        ),
      });
      return;
    }

    // Default list
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(
        makeProductsResponse(
          [{ id: 1, title: 'iPhone 9', category: 'smartphones', price: 549, stock: 94 }],
          40,
          skip,
          limit,
        ),
      ),
    });
  });
}
