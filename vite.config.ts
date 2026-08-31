import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig, UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  }
};

export default defineConfig(config);
