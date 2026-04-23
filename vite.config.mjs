import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  root: './dev',
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        // Reduce noise from third-party deps and silence legacy API warning
        quietDeps: true,
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  server: {
    port: 5050,
    open: true,
  },
  resolve: {
    alias: {
      '@': '../src',
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
  build: {
    outDir: '../dev/dist',
    emptyOutDir: true,
  },
})
