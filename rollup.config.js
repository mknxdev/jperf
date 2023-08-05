import serve from 'rollup-plugin-serve'
import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'

console.log(process.env.MODE);

// INPUT
const input = 'src/index.ts'

// OUTPUT
const output = []
if (process.env.MODE === 'production') {
  output.push({
    name: 'jTester',
    file: 'dist/jtester.js',
    format: 'umd',
  })
  output.push({
    name: 'jTester',
    file: 'dist/jtester.min.js',
    format: 'umd',
    plugins: [
      terser({
        compress: true,
      }),
    ],
  })
} else {
  output.push({
    name: 'jTester',
    file: 'public/dist/jtester.js',
    format: 'umd',
  })
}

// PLUGINS
const plugins = [typescript()]
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
