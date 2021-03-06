'use strict'

const path = require('path')
const _ = require('lodash')



// All configurations will extend these options
// ============================================
const all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 80,

  // Server IP
  ip: process.env.IP || '0.0.0.0',

  // Should we populate the DB with sample data?
  seedDB: true,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    jwt: 'T=DatKitsch#Y_TagSecret:@BB',
    session: ''
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  media: {
    path: 'app/public/media'
  },

  facebook: {
    clientID: process.env.FACEBOOK_ID || '',
    clientSecret: process.env.FACEBOOK_SECRET || '',
    callbackURL: (process.env.DOMAIN || '') + '/auth/facebook/callback'
  },

  instagram: {
    clientID: process.env.INSTAGRAM_ID || '',
    clientSecret: process.env.INSTAGRAM_SECRET || '',
    callbackURL: (process.env.DOMAIN || '') + '/auth/facebook/callback',
    accessToken: process.env.INSTAGRAM_ACCESS_TOKEN || ''
  },

  twitter: {
    clientID: process.env.TWITTER_ID || 'id',
    clientSecret: process.env.TWITTER_SECRET || 'secret',
    callbackURL: (process.env.DOMAIN || '') + '/auth/twitter/callback'
  },

  google: {
    clientID: process.env.GOOGLE_ID || 'id',
    clientSecret: process.env.GOOGLE_SECRET || 'secret',
    callbackURL: (process.env.DOMAIN || '') + '/auth/google/callback'
  }
}

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {})
