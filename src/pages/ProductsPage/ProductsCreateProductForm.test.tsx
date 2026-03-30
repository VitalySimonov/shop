import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { ProductsPage } from './ProductsPage';
import { renderApp } from '../../test/renderApp';
import { useAuthStore } from '../../implementation/auth/authStore';
import { server } from '../../test/server';

describe('ProductsCreateProductForm', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
  });

  function setAuthedSession() {
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
  }

  it('shows validation errors on empty submit', async () => {
    server.use(
      http.get('/api/products/category-list', async () => HttpResponse.json(['smartphones'])),
    );

    setAuthedSession();
    renderApp(<ProductsPage />, { route: '/products' });
    await screen.findByText(/все позиции/i);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /добавить/i }));
    await screen.findByText('Новый товар');

    await user.click(screen.getByRole('button', { name: 'Создать' }));

    expect(await screen.findByText('Введите название')).toBeInTheDocument();
    expect(await screen.findByText('Введите артикул')).toBeInTheDocument();
    expect(await screen.findByText('Выберите вендора')).toBeInTheDocument();
    expect(await screen.findByText('Введите цену')).toBeInTheDocument();
  });

  it('creates product successfully and shows success snackbar', async () => {
    server.use(
      http.get('/api/products/category-list', async () => HttpResponse.json(['smartphones'])),
      http.post('/api/products/add', async () =>
        HttpResponse.json({
          id: 999,
          title: 'Created',
          category: 'smartphones',
          price: 123,
          stock: 0,
        }),
      ),
    );

    setAuthedSession();
    renderApp(<ProductsPage />, { route: '/products' });
    await screen.findByText(/все позиции/i);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /добавить/i }));
    await screen.findByText('Новый товар');

    await user.type(screen.getByLabelText('Название'), 'Created');
    await user.type(screen.getByLabelText('Артикул'), 'SKU-123');

    await user.click(screen.getByLabelText('Вендор'));
    await user.click(await screen.findByRole('option', { name: 'Smartphones' }));

    await user.type(screen.getByLabelText('Цена'), '123');
    await user.click(screen.getByRole('button', { name: 'Создать' }));

    expect(await screen.findByText('Товар успешно создан')).toBeInTheDocument();
  });
});
