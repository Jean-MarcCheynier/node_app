/**
 * Main application file
 */

'use strict'

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'production'
console.log('Starting MODE : ' + process.env.NODE_ENV)

var express = require('express')
var mongoose = require('mongoose')
var promise = require('bluebird')
var config = require('./config/environment')
var passport = require('passport')
var User = require('./models/user')

// Setup server
console.log('Setting up express')
var app = express()
var http = require('http').Server(app)

// Connect to db
console.log('Connecting to DB')
mongoose.Promise = promise

var dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

// If auth specified, add auth config to the dbOptions object
if (config.mongo.username !== '' && config.mongo.password !== '') {
  dbOptions.auth = {
    user: config.mongo.username,
    password: config.mongo.password
  }
}

mongoose.connect(config.mongo.uri, dbOptions)

var db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('openUri', function () {
  // we're connected!
  console.log('CONNECTED TO : ' + config.mongo.uri)
})

require('./config/passport')(passport)
require('./config/express')(app)
require('./routes')(app, passport)

// Seed Admin User
User.findOne({ role: 'admin' }, function (err, data) {
  if (err) {

  } else {
    if (!data) {
      var user = new User()
      user.role = 'admin'
      user.local = {
        name: 'Admin',
        password: 'test'
      }
      user.save()
    } else {
      console.log('User already exist.')
    }
  }
})

// Start server
console.log('Starting web server')
http.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'))
})

// Expose app
exports = module.exports = app
