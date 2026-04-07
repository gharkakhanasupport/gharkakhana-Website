import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Gkk-Web/', // Updating to the new repository name
  publicDir: 'Gkk-Web',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
