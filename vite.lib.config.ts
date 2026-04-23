import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        silenceDeprecations: ['legacy-js-api'],
      },
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'VueAirbnbStyleDatepicker',
      fileName: (format) => format === 'umd' ? 'vue-airbnb-style-datepicker.js' : `vue-airbnb-style-datepicker.${format}.js`,
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      external: ['vue', 'v-click-outside', 'date-fns'],
      output: {
        globals: {
          vue: 'Vue',
          'v-click-outside': 'vClickOutside',
          'date-fns': 'dateFns',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
    outDir: 'dist'
  },
})
