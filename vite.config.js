// folioxe/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Ensure this is imported

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Ensure this is correctly added
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      },
      '/downloads': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
})