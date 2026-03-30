import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { login } from '../../../implementation/auth/authApi';
import { useAuthStore } from '../../../implementation/auth/authStore';

function loginErrorToUserMessage(error: unknown): string {
  const fallback = 'Не удалось войти. Попробуйте позже.';
  if (!(error instanceof Error) || !error.message) {
    return fallback;
  }
  const msg = error.message;
  const lower = msg.toLowerCase();
  if (
    lower.includes('invalid credentials') ||
    lower.includes('unauthorized') ||
    /^request failed:\s*401\b/i.test(msg)
  ) {
    return 'Неверный логин или пароль';
  }

  if (
    lower === 'failed to fetch' ||
    lower.includes('networkerror') ||
    lower.includes('load failed') ||
    lower.includes('network request failed')
  ) {
    return 'Сервер недоступен (нет сети или не запущен dev-сервер с прокси /api).';
  }
  return msg;
}

export function useLoginMutation() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      const rememberMe = useAuthStore.getState().rememberMe;
      setSession({ accessToken: data.accessToken, user: data, rememberMe });
      queryClient.setQueryData(['me'], data);
      const targetPath = (location.state as { from?: string } | null)?.from ?? '/products';
      navigate(targetPath, { replace: true });
    },
  });

  const submitErrorMessage = useMemo(
    () => (loginMutation.isError ? loginErrorToUserMessage(loginMutation.error) : null),
    [loginMutation.isError, loginMutation.error],
  );

  return {
    loginMutation,
    submitErrorMessage,
    isPending: loginMutation.isPending,
  };
}
