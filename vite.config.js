import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'Gkk-Web',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});