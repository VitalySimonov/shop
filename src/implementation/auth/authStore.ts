import { create } from 'zustand';
import type { IUser } from '../../types/User';

const ACCESS_TOKEN_COOKIE_KEY = 'auth_access_token';
const ACCESS_TOKEN_SESSION_KEY = 'auth.accessToken';
const STORAGE_TIME = 60 * 60;

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + maxAgeSeconds * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Expires=${expires}; Path=/; SameSite=Lax`;
}

function clearCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax`;
}

function readInitialSession() {
  const cookieToken = getCookie(ACCESS_TOKEN_COOKIE_KEY);
  if (cookieToken) {
    return { accessToken: cookieToken, rememberMe: true };
  }

  const sessionToken = sessionStorage.getItem(ACCESS_TOKEN_SESSION_KEY);
  if (sessionToken) {
    return { accessToken: sessionToken, rememberMe: false };
  }

  return { accessToken: null, rememberMe: false };
}

function persistAccessToken(accessToken: string | null, rememberMe: boolean) {
  if (!accessToken) {
    clearCookie(ACCESS_TOKEN_COOKIE_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_SESSION_KEY);
    return;
  }

  if (rememberMe) {
    setCookie(ACCESS_TOKEN_COOKIE_KEY, accessToken, STORAGE_TIME);
    sessionStorage.removeItem(ACCESS_TOKEN_SESSION_KEY);
  } else {
    sessionStorage.setItem(ACCESS_TOKEN_SESSION_KEY, accessToken);
    clearCookie(ACCESS_TOKEN_COOKIE_KEY);
  }
}

interface IAuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: IUser | null;
  rememberMe: boolean;
  setRememberMe: (rememberMe: boolean) => void;
  setSession: (payload: { accessToken: string; user: IUser; rememberMe?: boolean }) => void;
  clearSession: () => void;
  setUser: (user: IUser | null) => void;
}

const initialSession = readInitialSession();

export const useAuthStore = create<IAuthState>((set, get) => ({
  accessToken: initialSession.accessToken,
  isAuthenticated: false,
  user: null,
  rememberMe: initialSession.rememberMe,
  setRememberMe: (rememberMe) => set({ rememberMe }),
  setSession: ({ accessToken, user, rememberMe }) => {
    const mode = rememberMe ?? get().rememberMe;
    persistAccessToken(accessToken, mode);
    set({ accessToken, user, rememberMe: mode, isAuthenticated: true });
  },
  clearSession: () => {
    persistAccessToken(null, false);
    set({ accessToken: null, user: null, isAuthenticated: false });
  },
  setUser: (user) =>
    set((state) => ({ user, isAuthenticated: Boolean(state.accessToken && user) })),
}));
