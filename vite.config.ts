// vite.config.js
/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base:
    process.env.NODE_ENV === 'production' && process.env.VERCEL
      ? '/'
      : '/memolist1-app/',
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
});
