import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false, // Отключаем автоматическое открытие браузера
    host: true
  },
  define: {
    global: 'globalThis',
  },
  // Добавляем расширения файлов для обработки
  resolve: {
    alias: {
      '@': '/src',
    }
  }
})