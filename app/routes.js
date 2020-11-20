'use strict'

const errors = require('./components/errors')

module.exports = function (app, passport) {
  app.all('/', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'X-Requested-With')
    next()
  })
  // Secure api routes
  app.use('/alive', function (req, res) { res.json('Alive') })
  app.all('/api/*', passport.authenticate('jwt', { session: false }))

  // Insert routes below
  app.use('/api/user', require('./controllers/private/userController')())
  app.use('/api/image', require('./controllers/private/imageController')())
  app.use('/api/statement', require('./controllers/private/statementController')())

  // Default routes
  app.use('/', require('./controllers/public/index')())

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404])
}
