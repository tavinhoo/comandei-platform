import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// VITE_API_URL is injected via Docker Compose environment, fallback for local dev
const backendUrl = process.env.VITE_API_URL ?? 'http://localhost:8080'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // obrigatório para rodar dentro do container Docker
    port: 5173,
    proxy: {
      '/api': {
        target: backendUrl,
        changeOrigin: true,
      },
      '/auth': {
        target: backendUrl,
        changeOrigin: true,
      },
    },
  },
})
