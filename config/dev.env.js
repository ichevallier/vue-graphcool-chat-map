'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  GRAPHCOOL_API: '"YOUR_SERVICE_ID"',
  GOOGLE_KEY:'"YOUR-GOOGLE-KEY"',
})
