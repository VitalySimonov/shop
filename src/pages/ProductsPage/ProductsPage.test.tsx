import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { ProductsPage } from './ProductsPage';
import { renderApp } from '../../test/renderApp';
import { useAuthStore } from '../../implementation/auth/authStore';
import { server } from '../../test/server';

describe('ProductsPage', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
  });

  it('renders products table rows', async () => {
    useAuthStore.getState().setSession({
      accessToken: 'test-token',
      user: {
        id: 1,
        username: 'emilys',
        email: 'emily.johnson@x.dummyjson.com',
        firstName: 'Emily',
        lastName: 'Johnson',
        gender: 'female',
        image: 'https://dummyjson.com/icon/emilys/128',
      },
    });

    renderApp(<ProductsPage />, { route: '/products' });

    await waitFor(() => {
      expect(screen.getByText('iPhone 9')).toBeInTheDocument();
    });
  });

  it('submits search and renders new results', async () => {
    server.use(
      http.get('/api/products/search', async ({ request }) => {
        const url = new URL(request.url);
        const q = url.searchParams.get('q');
        if (q?.toLowerCase() === 'mac') {
          return HttpResponse.json({
            products: [
              { id: 10, title: 'MacBook Pro', category: 'laptops', price: 1999, stock: 10 },
            ],
            total: 1,
            skip: 0,
            limit: 20,
          });
        }
        return HttpResponse.json({ products: [], total: 0, skip: 0, limit: 20 });
      }),
    );

    useAuthStore.getState().setSession({
      accessToken: 'test-token',
      user: {
        id: 1,
        username: 'emilys',
        email: 'emily.johnson@x.dummyjson.com',
        firstName: 'Emily',
        lastName: 'Johnson',
        gender: 'female',
        image: 'https://dummyjson.com/icon/emilys/128',
      },
    });

    renderApp(<ProductsPage />, { route: '/products' });

    await screen.findByText('iPhone 9');

    const user = userEvent.setup();
    const searchInput = screen.getByPlaceholderText('Найти');
    await user.clear(searchInput);
    await user.type(searchInput, 'mac{Enter}');

    expect(await screen.findByText('MacBook Pro')).toBeInTheDocument();
  });

  it('sends server-side sort params and updates rows', async () => {
    server.use(
      http.get('/api/products', async ({ request }) => {
        const url = new URL(request.url);
        const sortBy = url.searchParams.get('sortBy');
        const order = url.searchParams.get('order');

        const title = sortBy === 'price' && order === 'asc' ? 'Cheap Item' : 'Default Item';

        return HttpResponse.json({
          products: [{ id: 1, title, category: 'misc', price: 10, stock: 1 }],
          total: 1,
          skip: Number(url.searchParams.get('skip') ?? 0),
          limit: Number(url.searchParams.get('limit') ?? 20),
        });
      }),
    );

    useAuthStore.getState().setSession({
      accessToken: 'test-token',
      user: {
        id: 1,
        username: 'emilys',
        email: 'emily.johnson@x.dummyjson.com',
        firstName: 'Emily',
        lastName: 'Johnson',
        gender: 'female',
        image: 'https://dummyjson.com/icon/emilys/128',
      },
    });

    renderApp(<ProductsPage />, { route: '/products' });

    await screen.findByText('Default Item');

    const user = userEvent.setup();
    await user.click(screen.getByRole('columnheader', { name: /цена/i }));

    expect(await screen.findByText('Cheap Item')).toBeInTheDocument();
  });
});
