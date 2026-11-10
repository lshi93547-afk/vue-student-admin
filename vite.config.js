import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // 相对路径打包，方便直接丢到宝塔/任意静态目录
  base: './',
  plugins: [vue()],
  server: { port: 5173, open: true }
})
