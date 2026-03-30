import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

const apiProxy = {
  '/api': {
    target: 'https://dummyjson.com',
    changeOrigin: true,
    secure: true,
    rewrite: (path: string) => path.replace(/^\/api/, ''),
  },
} as const;

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Браузер ходит на same-origin /api, Vite проксирует на dummyjson.com
      ...apiProxy,
    },
  },
  preview: {
    // `vite preview` — тот же прокси, что и у dev (иначе `/api` → 404)
    proxy: { ...apiProxy },
  },
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
    testTimeout: 15000,
  },
});
