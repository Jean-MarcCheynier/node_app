const logger = require('./winston')
const config = require('./environment')
const mongoose = require('mongoose')
const promise = require('bluebird')
const User = require('../models/user')

module.exports = function () {
  mongoose.Promise = promise

  const dbOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    ...(config.mongo.username !== '' && config.mongo.password !== '')
      ? { auth: { user: config.mongo.username, password: config.mongo.password } }
      : {}
  }

  mongoose.connect(process.env.MONGO_URI, dbOptions)
  const db = mongoose.connection

  db.on('error', () => logger.log('Could not connect to MongoDB'))
  db.once('open', () => logger.info('Connected to MongoDB'))

  // Seed Admin User
  User.findOne({ role: 'admin' }).then(data => {
    if (!data) {
      logger.info('No user present, initializing default admin user')
      const user = new User()
      user.role = 'admin'
      user.local = {
        login: process.env.DEFAULT_ADMIN_USER,
        password: process.env.DEFAULT_ADMIN_PWD
      }
      user.save()
    }
  })
}
