require('@babel/register')({
  presets: ['@babel/preset-env'],
  plugins: ['@babel/plugin-proposal-optional-chaining', '@babel/plugin-syntax-top-level-await'],
})

const fs = require('fs-extra')
const path = require('path')

const buildDir = path.resolve(__dirname, './build/')
global.ROOT = buildDir

fs.ensureDirSync(buildDir)

require('./underlords')
