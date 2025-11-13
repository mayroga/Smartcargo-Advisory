import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración estándar para despliegues en Render o cualquier hosting
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 5173,
    open: true
  }
});
