'use strict'

const express = require('express')
const router = express.Router()
const UserGroupService = require('../../services/userGroupService')

// All bets
module.exports = function () {
  router.route('/')
    .get(function (req, res) {
      UserGroupService.findAll(
        req.user._id,
        function (_err, data) {
          res.json(data)
        }
      )
    })
    .post(function (req, res) {
      const userId = req.user._id
      console.log(req.body)
      UserGroupService.save(req.body, userId, function (err, data) {
        if (err) { res.json({ success: false, errmsg: '' }) } else { res.json(data) }
      })
    })

    .put(function (req, res) {
      UserGroupService.update(
        req.body,
        function (_err, data) { res.json(data) }
      )
    })
    .delete(function (req, res) {
      UserGroupService.signout(
        req.body.id,
        function (_err, data) { res.json(data) }
      )
    })

  // Bets by ID
  router.route('/:id')
    .get(function (req, res) {
      UserGroupService.findById(
        req.params.id,
        req.user._id,
        function (_err, data) {
          res.json(data)
        }
      )
    })

  return router
}
