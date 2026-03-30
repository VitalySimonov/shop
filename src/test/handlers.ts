import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('https://dummyjson.com/auth/login', async () =>
    HttpResponse.json({
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
  ),
  http.post('/api/auth/login', async () =>
    HttpResponse.json({
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
  ),
  http.get('https://dummyjson.com/products/search', async () =>
    HttpResponse.json({
      products: [{ id: 1, title: 'iPhone 9', category: 'smartphones', price: 549, stock: 94 }],
      total: 1,
      skip: 0,
      limit: 10,
    }),
  ),
  http.get('https://dummyjson.com/products', async () =>
    HttpResponse.json({
      products: [{ id: 1, title: 'iPhone 9', category: 'smartphones', price: 549, stock: 94 }],
      total: 1,
      skip: 0,
      limit: 10,
    }),
  ),
  http.get('/api/products/search', async () =>
    HttpResponse.json({
      products: [{ id: 1, title: 'iPhone 9', category: 'smartphones', price: 549, stock: 94 }],
      total: 1,
      skip: 0,
      limit: 10,
    }),
  ),
  http.get('/api/products', async () =>
    HttpResponse.json({
      products: [{ id: 1, title: 'iPhone 9', category: 'smartphones', price: 549, stock: 94 }],
      total: 1,
      skip: 0,
      limit: 10,
    }),
  ),
  http.post('https://dummyjson.com/products/add', async () =>
    HttpResponse.json({
      id: 2,
      title: 'New Product',
      category: 'misc',
      price: 100,
      stock: 10,
    }),
  ),
  http.post('/api/products/add', async () =>
    HttpResponse.json({
      id: 2,
      title: 'New Product',
      category: 'misc',
      price: 100,
      stock: 10,
    }),
  ),
  http.get('https://dummyjson.com/products/category-list', async () =>
    HttpResponse.json(['smartphones', 'laptops']),
  ),
  http.get('/api/products/category-list', async () =>
    HttpResponse.json(['smartphones', 'laptops']),
  ),
  http.post('https://dummyjson.com/auth/refresh', async () =>
    HttpResponse.json({ accessToken: 'test-refreshed-token' }),
  ),
  http.post('/api/auth/refresh', async () =>
    HttpResponse.json({ accessToken: 'test-refreshed-token' }),
  ),
  http.get('https://dummyjson.com/auth/me', async () =>
    HttpResponse.json({
      id: 1,
      username: 'emilys',
      email: 'emily.johnson@x.dummyjson.com',
      firstName: 'Emily',
      lastName: 'Johnson',
      gender: 'female',
      image: 'https://dummyjson.com/icon/emilys/128',
    }),
  ),
  http.get('/api/auth/me', async () =>
    HttpResponse.json({
      id: 1,
      username: 'emilys',
      email: 'emily.johnson@x.dummyjson.com',
      firstName: 'Emily',
      lastName: 'Johnson',
      gender: 'female',
      image: 'https://dummyjson.com/icon/emilys/128',
    }),
  ),
];
