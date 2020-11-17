'use strict'

const express = require('express')
const router = express.Router()
const multer = require('multer')
const ImageService = require('../../services/ImageService')
const { allow } = require('../middleware/passportMiddleware')

// STORAGE CONFIG TO EXTERNALIZE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/tmp')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + '.png')
  }
})

const upload = multer({ storage: storage })

module.exports = function () {
  router.route('/')
    .post(upload.single('file'), function (req, res) {
      let documentType
      if (req.body) {
        documentType = req.body.documentType
      }
      if (req.file) {
        req.file.documentType = documentType
        ImageService.save(req.user, req.file,
          function (err, data) {
            if (err) {
              res.status(500).json({ errmsg: 'ERR' })
            } else {
              res.json(data)
            }
          })
      }
    })
    .get(allow('me', 'admin', 'insurer'), (req, res) => {
      switch (req.user.role) {
        case 'user': ImageService.findByOwnerId(req.user._id)
          .then(data => res.json(data))
          break
        case 'insurer': ImageService.findAll()
          .then(data => res.json(data))
          break
        default: return res.status(401).json({ errmsg: 'ERR' })
      }
    })

  router.route('/:imageId')
    .get(function (req, res) {
      ImageService.findById(req.params.imageId)
        .then(response => {
          const image64 = Buffer.from(response.data, 'base64')
          res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Transfer-Encoding': 'base64',
            'Content-Length': image64.length
          })
          res.end(image64)
        })
        .catch(e => {
          res.status(500).send({ message: 'Cannot Retreive image' })
        })
    })
  return router
}
