// I configure Vite here so my React app runs smoothly.
// I also add a nice "@" alias and set up a proxy to talk to the backend.

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // I can now import from "@/..." instead of long relative paths
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,        // I pick the default Vite port
    strictPort: false, // I let it move if the port is busy
    proxy: {
      // I forward API calls to my FastAPI backend
      '/api':     { target: 'http://127.0.0.1:8000', changeOrigin: true, secure: false },
      '/healthz': { target: 'http://127.0.0.1:8000', changeOrigin: true, secure: false },
    },
  },
})
