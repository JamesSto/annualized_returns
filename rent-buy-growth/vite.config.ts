import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/projects/rent-buy-growth/',
  build: {
    sourcemap: true, // Enable source maps
  },
})
