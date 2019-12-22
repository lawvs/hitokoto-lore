require('@babel/register')({
  presets: ['@babel/preset-env'],
  plugins: ['@babel/plugin-proposal-optional-chaining', '@babel/plugin-syntax-top-level-await'],
})

const fs = require('fs')
const path = require('path')

const buildDir = path.resolve(__dirname, './build/')
global.ROOT = buildDir

if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir)
}
