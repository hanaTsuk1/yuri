import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  define: {
    'process.env.NODE_ENV': 'process.env.NODE_ENV'
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'yuri',
      formats: ['es'],
    },
  },
  plugins: [dts({
    include: ["src/index.ts", "src/layout.ts"]
  })]
})
