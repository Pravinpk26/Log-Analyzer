/**
 * vite.config.js
 * Proxies all backend routes to FastAPI on port 8000.
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/login':       'http://127.0.0.1:8000',
      '/verify':      'http://127.0.0.1:8000',
      '/scan':        'http://127.0.0.1:8000',
      '/ai-insights': 'http://127.0.0.1:8000',
      '/events':      'http://127.0.0.1:8000',
      '/upload-log':  'http://127.0.0.1:8000',
      '/dashboard':   'http://127.0.0.1:8000',
    }
  }
})
