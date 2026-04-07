import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/gkk2026/', // 👈 ADD THIS LINE (must match your repo name)
  publicDir: 'Gkk-Web',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
