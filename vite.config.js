import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/static/', // <-- TAMBAHAN 1: Biar file JS/CSS mengarah ke /static/
  build: {
    outDir: '../backend/static_build', // <-- TAMBAHAN 2: Kita lempar hasil build langsung ke folder backend
    emptyOutDir: true,
  }
})
