const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const logger = require('./winston')

// load up the user model
const UserService = require('../services/userService')

function getPassportConfig () {
  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.JWT_SECRET
  }
  passport.use(new JwtStrategy(opts, function (jwtPayload, done) {
    UserService.findById(jwtPayload._id)
      .then(user => {
        logger.debug('Auth success')
        done(null, user)
        return true
      })
      .catch(e => {
        logger.debug('Auth error')
        done(e, false)
        return false
      })
  }))
  return passport
}

module.exports = getPassportConfig
