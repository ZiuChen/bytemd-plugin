import { defineConfig } from 'rolldown'
import { dts } from 'rolldown-plugin-dts'
import copy from 'rollup-plugin-copy'

export default defineConfig({
  input: 'src/index.ts',
  output: {
    format: 'es',
    sourcemap: true
  },
  plugins: [
    dts(),
    copy({
      targets: [
        {
          src: 'public/**/*',
          dest: 'dist/'
        }
      ]
    })
  ]
})
