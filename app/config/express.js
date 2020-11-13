'use strict'

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const compression = require('compression')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const errorHandler = require('errorhandler')
const path = require('path')
const config = require('./environment')

function createExpressApp () {
  const app = express()
  app.set('trust proxy', true) // specify a single subnet
  app.set('views', config.root + '/app/views')
  app.set('view engine', 'pug')
  app.set('view options', { layout: false })
  app.set('superSecret', config.secrets.superSecret)
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })
  app.use(compression())
  app.use(morgan('dev')) // log every request to the console
  app.use(express.json()) // for parsing application/json
  app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
  app.use(methodOverride())
  app.use(cookieParser())
  app.use(cors())

  app.use(express.static(path.join(config.root, 'app/public')))
  app.use(express.static(path.join(config.root, 'node_modules')))
  app.set('appPath', path.join(config.root, 'app/public'))
  app.use(errorHandler()) // Error handler - has to be last

  return app
};

module.exports = createExpressApp
