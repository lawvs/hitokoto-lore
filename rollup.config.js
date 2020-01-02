import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import json from '@rollup/plugin-json'
// import { terser } from 'rollup-plugin-terser'

export default {
  input: 'index.ts',
  output: [
    { file: 'build/main.esm.js', format: 'esm' },
    {
      file: 'build/main.global.js',
      format: 'iife',
      name: 'Lore',
    },
  ],
  plugins: [typescript(), commonjs(), resolve(), json()],
}
