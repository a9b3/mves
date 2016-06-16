#!/usr/bin/env node
const path = require('path')

require('babel-register')({})
require('babel-polyfill')
require('app-module-path').addPath(path.resolve(__dirname, 'src'))
require('./src')
