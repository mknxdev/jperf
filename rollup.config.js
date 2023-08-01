import serve from 'rollup-plugin-serve'
import typescript from '@rollup/plugin-typescript'

const plugins = [
  typescript(),
]
if (process.env.MODE === 'local')
  plugins.splice(
    0,
    0,
    serve({
      contentBase: 'public',
      port: 8080,
    }),
  )

export default {
  input: 'src/index.ts',
  output: [
    {
      name: 'jtester',
      file: 'public/dist/jtester.js',
      format: 'umd',
    },
  ],
  plugins,
}
