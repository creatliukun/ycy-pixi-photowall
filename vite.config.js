import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 启动ip，为ip做配置
  server: {
    host: '0.0.0.0'
  }
})
