import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@data': path.resolve(__dirname, './src/data'),
      '@utils': path.resolve(__dirname, './src/utils'),
      // Add alias for API to prevent accidental client-side imports
      '@api': path.resolve(__dirname, './api'),
    }
  },
  build: {
    outDir: 'client/dist', // Keep it simple, builds into client/dist
    emptyOutDir: true
  }
});
