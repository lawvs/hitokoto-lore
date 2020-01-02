require('@babel/register')({
  presets: ['@babel/preset-env'],
  plugins: ['@babel/plugin-proposal-optional-chaining'],
})

const fs = require('fs-extra')
const path = require('path')

const buildDir = path.resolve(__dirname, './build/')
global.BUILD_ROOT = buildDir
global.ROOT = __dirname

fs.ensureDirSync(buildDir)

console.log('Build underlords...')
require('./underlords')
console.log('Merge meta information...')
require('./merge-meta')
console.log('Build Success.')
