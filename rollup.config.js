import serve from 'rollup-plugin-serve'
import typescript from '@rollup/plugin-typescript'
import { dts } from 'rollup-plugin-dts'
import terser from '@rollup/plugin-terser'
import json from '@rollup/plugin-json'

// INPUT
const input = 'src/index.ts'

// OUTPUT
let tsConfig
const output = []
if (process.env.MODE === 'production') {
  tsConfig = {
    // exclude: ['tests/**/*'],
    declaration: true,
    declarationDir: 'dist/',
  }
  output.push({
    name: 'jperf',
    file: 'dist/jperf.js',
    format: 'umd',
  })
  output.push({
    name: 'jperf',
    file: 'dist/jperf.min.js',
    format: 'umd',
    plugins: [
      terser({
        compress: true,
      }),
    ],
  })
  output.push({
    file: 'dist/jperf.esm.js',
    format: 'es',
  })
  output.push({
    file: 'dist/jperf.esm.min.js',
    format: 'es',
    plugins: [
      terser({
        compress: true,
      }),
    ],
  })
  output.push({
    name: 'jperf',
    file: 'dist/types.d.ts',
    format: 'es',
  })
} else {
  tsConfig = {
    declaration: true,
    declarationDir: 'dist/',
  }
  output.push({
    name: 'jperf',
    file: 'public/dist/jperf.js',
    format: 'umd',
  })
}

// PLUGINS
const plugins = [
  typescript(tsConfig),
  dts(),
  json()
]
if (process.env.MODE === 'local')
  plugins.splice(
    0,
    0,
    serve({
      contentBase: 'public',
      port: 8090,
    }),
  )

export default {
  input,
  output,
  plugins,
}
