import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { LoginPage } from './LoginPage';
import { renderApp } from '../../test/renderApp';
import { useAuthStore } from '../../implementation/auth/authStore';
import { server } from '../../test/server';

describe('LoginPage', () => {
  beforeEach(() => {
    useAuthStore.getState().clearSession();
  });

  it('shows validation errors when submitting empty form', async () => {
    renderApp(<LoginPage />);

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /войти/i }));

    expect(await screen.findByText('Введите логин')).toBeInTheDocument();
    expect(await screen.findByText('Введите пароль')).toBeInTheDocument();
  });

  it('logs in successfully and stores session', async () => {
    renderApp(<LoginPage />);

    const user = userEvent.setup();

    const usernameInput = document.querySelector<HTMLInputElement>('input[name="username"]');
    const passwordInput = document.querySelector<HTMLInputElement>('input[name="password"]');
    if (!usernameInput || !passwordInput) {
      throw new Error('Login inputs not found');
    }

    await user.type(usernameInput, 'emilys');
    await user.type(passwordInput, 'emilyspass');
    await user.click(screen.getByRole('button', { name: /войти/i }));

    await waitFor(() => {
      expect(useAuthStore.getState().isAuthenticated).toBe(true);
      expect(useAuthStore.getState().accessToken).toBe('test-token');
    });
  });

  it('shows user-friendly error on invalid credentials', async () => {
    server.use(
      http.post('/api/auth/login', async () =>
        HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 }),
      ),
    );

    renderApp(<LoginPage />);

    const user = userEvent.setup();

    const usernameInput = document.querySelector<HTMLInputElement>('input[name="username"]');
    const passwordInput = document.querySelector<HTMLInputElement>('input[name="password"]');
    if (!usernameInput || !passwordInput) {
      throw new Error('Login inputs not found');
    }

    await user.type(usernameInput, 'bad');
    await user.type(passwordInput, 'bad');
    await user.click(screen.getByRole('button', { name: /войти/i }));

    expect(await screen.findByText('Неверный логин или пароль')).toBeInTheDocument();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
