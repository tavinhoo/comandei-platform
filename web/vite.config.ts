import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: { usePolling: true },
    proxy: {
      '/api': {
        target: 'http://cmdi-api:8080',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://cmdi-api:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: { sourcemap: false, minify: 'esbuild' },
  esbuild: { drop: ['console', 'debugger'] },
})
