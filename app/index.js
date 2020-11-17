/**
 * Main application file
 */
'use strict'

require('dotenv').config()
const logger = require('./config/winston')
const http = require('http')
logger.info(`Starting MODE:  ${process.env.NODE_ENV}`)

// Require all config files
require('./config/mongoDB')()
const passport = require('./config/passport')()
const app = require('./config/express')()
require('./routes')(app, passport)

// Start server
const server = http.createServer(app)
server.listen(process.env.PORT)
server.on('error', (e) => {
  switch (e.code) {
    case 'EADDRINUSE':
      logger.error(`Port ${process.env.PORT} already in use`)
      logger.info(`You can kill it running th following comande : kill -9 $(lsof -t -i:${process.env.PORT})`)
      break
    default:
      logger.error('Server could not start')
      break
  }
  logger.error()
})
server.on('listening', () => logger.info(`Express server listening on ${process.env.PORT}, in ${process.env.NODE_ENV} mode`))

exports = module.exports = app
