import { useQuery } from '@tanstack/react-query';
import { useLayoutEffect } from 'react';
import { getCurrentUser } from './authApi';
import { useAuthStore } from './authStore';

export function useAuthBootstrap() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const clearSession = useAuthStore((state) => state.clearSession);

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: ({ signal }) => getCurrentUser(signal),
    enabled: Boolean(accessToken),
    retry: false,
  });

  // Синхронно до paint: иначе один кадр с isFetching=false и isAuthenticated=false
  // даёт мигание экрана логина при восстановлении сессии.
  useLayoutEffect(() => {
    if (meQuery.data) {
      setUser(meQuery.data);
    }
    if (meQuery.isError) {
      clearSession();
    }
  }, [clearSession, meQuery.data, meQuery.isError, setUser]);

  // Пока нет user — ждём ответ /auth/me (после success ещё один кадр до setUser в layout).
  // Если user уже есть (после логина), refetch не блокирует экран.
  const isBootstrapping =
    Boolean(accessToken) &&
    !user &&
    (meQuery.isPending || meQuery.isFetching || (meQuery.isSuccess && Boolean(meQuery.data)));
  return { isBootstrapping };
}
