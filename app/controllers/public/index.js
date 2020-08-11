'use strict'

var express = require('express')
var router = express.Router()
var config = require('../../config/environment')
var jwt = require('jsonwebtoken')
var UserService = require('../../services/userService')

module.exports = function () {
  router.post('/forgotten-password', function () {

  })

  router.post('/signup', function (req, res) {
    console.log('signing up')
    if (!req.body.name || !req.body.password) {
      res.json({ success: false, message: 'Please enter username and password.' })
    } else {
      UserService.save({
        local:
          {
            name: req.body.name,
            password: req.body.password,
            email: req.body.email
          },
        lang: req.body.lang
      }, function (err, data) {
        if (err) {
          return res.json({ success: false, errmsg: err.publicmsg })
        }
        if (data.local.email) { }

        return res.json({ success: true, user: data })
      })
    }
  })

  router.post('/signin', function (req, res) {
    UserService.findOne({ 'local.name': req.body.name }, function (err, user) {
      if (err) { throw err }
      if (!user) {
        res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' })
      } else {
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            var token = jwt.sign(user.toObject(), config.secrets.jwt, { expiresIn: '1d' })
            var tosend = user.toObject()
            if (tosend.role === 'pre') {
              res.status(401).send({ success: false, msg: 'Your account has been created but not yet validated by an administrator.' })
            } else {
              tosend.jwt = 'JWT ' + token
              if (user.role === 'pre') { user.set({ role: 'user' }) }
              user.signedIn.push(new Date())
              res.json(tosend)
            }
          } else {
            res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' })
          }
        })
      }
    })
  })

  // Partials views
  router.get('/template/:partial', function (req, res) {
    console.debug('Requesting '.concat(req.param.partial))
    var isAdmin = (req.user != undefined && req.user.local.role === 'admin')
    res.render(req.params.partial, { isAdmin: isAdmin })
  })

  // All other routes should redirect to the index.html
  router.get('/me', function (req, res) {
    res.render('me', { socket_url: process.env.SOCKET_URL || 'localhost:80' })
  })

  router.get('*', function (req, res) {
    res.redirect('/')
  })

  return router
}
