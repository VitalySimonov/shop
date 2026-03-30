import { useAuthStore } from './authStore';

const API_URL = import.meta.env.VITE_API_URL ?? '/api';
const CREDENTIALS: RequestCredentials = API_URL.startsWith('/') ? 'include' : 'omit';
let refreshPromise: Promise<string | null> | null = null;

type RequestOptions = RequestInit & {
  auth?: boolean;
  skipRefresh?: boolean;
};

async function refreshToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiresInMins: 60 }),
        credentials: CREDENTIALS,
      });

      if (!response.ok) {
        useAuthStore.getState().clearSession();
        return null;
      }

      const data = (await response.json()) as { accessToken?: string };
      if (!data.accessToken) {
        useAuthStore.getState().clearSession();
        return null;
      }

      const { user } = useAuthStore.getState();
      if (user) {
        useAuthStore.getState().setSession({ accessToken: data.accessToken, user });
      }
      return data.accessToken;
    } catch {
      useAuthStore.getState().clearSession();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function apiClient<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = false, skipRefresh = false, headers, ...restOptions } = options;
  const { accessToken } = useAuthStore.getState();

  const response = await fetch(`${API_URL}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    credentials: CREDENTIALS,
  });

  if (response.status === 401 && auth && !skipRefresh) {
    const refreshedToken = await refreshToken();
    if (refreshedToken) {
      return apiClient<T>(path, {
        ...options,
        skipRefresh: true,
      });
    }
  }

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const errorBody = (await response.json()) as { message?: string };
      if (errorBody.message) {
        message = errorBody.message;
      }
    } catch {
      // noop
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}
