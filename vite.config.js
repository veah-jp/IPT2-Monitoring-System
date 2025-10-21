import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        reports: path.resolve(__dirname, 'resources/js/react/simple-reports.jsx')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'resources/js/react')
    }
  }
});
