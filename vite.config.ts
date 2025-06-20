// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base:
    process.env.NODE_ENV === 'production' && process.env.VERCEL
      ? '/'
      : '/memolist1-app/',
});
