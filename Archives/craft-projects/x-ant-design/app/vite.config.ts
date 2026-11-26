import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Absolute base so deep routes (/docs/..., /components/...) resolve assets
  // when opened directly, mirroring how the docs site is served at origin root.
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
  },
});
