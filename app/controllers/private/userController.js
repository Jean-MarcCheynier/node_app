'use strict'

const express = require('express')
const { allow } = require('../middleware/passportMiddleware')
const UserService = require('../../services/userService')
const router = express.Router()

module.exports = function () {
  router.route('/')
    .get(function (req, res) {
      UserService.findAll(
        function (_err, data) {
          res.json(data)
        }
      )
    })

  router.route('/:userId')
    .get(allow('admin'), function (req, res) {
      console.log('then')
      UserService.findById(req.params.userId,
        function (_err, data) {
          res.json(data)
        }
      )
    })
    .put(allow('me', 'admin'), function (req, res) {
      UserService.update(req.body,
        function (_err, data) {
          res.json(data)
        }
      )
    })
    .delete(allow('me', 'admin'), function (req, res) {
      UserService.deleteById(req.params.userId,
        function (_err, data) {
          res.json(data)
        }
      )
    })

  router.route('/:userId/accept')
    .post(allow('admin'), function (req, res) {
      console.log(req.params.userId)
      UserService.accept(req.params.userId, (_err, data) => res.json(data))
    })

  router.route('/password/reset')
    .post(function (req, res) {
      if (req.user._id !== req.body._id) { res.send(401, 'unauthorized') }
      UserService.update(req.body, (_err, data) => {
        res.json(data)
      })
    })

  return router
}
