import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target:
          process.env.API_PROXY ||
          loadEnv(mode, process.cwd(), '').API_PROXY ||
          'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
}));
