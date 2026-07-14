import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default ({ mode }) => {
  // Load environment variables (from .env, .env.local, etc.)
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'http://localhost:5000'

  return defineConfig({
    plugins: [react()],
    server: {
      proxy: {
        // Proxy API requests to avoid CORS issues during development.
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  })
}
