import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: ['es2018', 'safari13'],
    cssTarget: 'safari13',      // converts nested CSS and newer shorthands for old browsers
  },
})