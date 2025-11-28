import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import commonjs from '@rollup/plugin-commonjs'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue(), commonjs()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    include: ['mammoth']
  }
})
