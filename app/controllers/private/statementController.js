'use strict'

const express = require('express')
const router = express.Router()
const multer = require('multer')
const ImageService = require('../../services/ImageService')
const StatementService = require('../../services/statementService')
const logger = require('../../config/winston')

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
    .post((req, res) => {
      const userId = req.user.id
      StatementService.save({ owner: userId })
        .then(data => {
          res.json(data)
        })
        .catch(e => {
          console.error(e)
          res.status(500).send('error')
        })
    })
    .get((req, res) => {
      const userId = req.user.id
      StatementService.findByOwnerId(userId)
        .then(data => res.json(data))
        .catch(e => res.status(500).send(e))
    })

  router.route('/:id')
    .get((req, res) => {
      const { userId } = req.user
      const { id } = req.params
      StatementService.findById(id)
        .then(data => {
          if (data.ownerId === userId) {
            res.json(data)
          } else {
            res.status(401).send({ message: 'Unauthorized, you cannot access this statement' })
          }
        })
        .catch(e => res.status(500).send({ message: 'Internal server error' }))
    })

  // DownloadPDF
  router.route('/:id/pdf')
    .get(async (req, res) => {
      // const userId = req.user._id
      // const statement = await StatementService.findById(id).catch(e => { /* Handle error */ })
      // const pdf = PDFService.generate()
    })

  router.route('/:statementId/upload/doc/:docType')
    .post(upload.single('file'), async (req, res) => {
      const { docType, statementId } = req.params
      logger.info(`Exporting document type : ${docType} in statement ${statementId}`)
      const user = req.user

      // Control the parameters
      if (!statementId) {
        res.status(403).send({ message: 'Param statementId is missing' })
        return
      }
      if (!docType || !['ID_FR', 'ID_BE', 'GREEN_CARD', 'DRIVING_LICENSE', 'DAMAGE'].includes(docType)) { res.status(403).send({ message: 'Param docType is missing' }) }
      if (!req.file) { res.status(403).send({ message: 'File is missing' }) }

      // Retreive the statement
      let statement
      try {
        statement = await StatementService.findById(statementId)
      } catch (e) {
        res.status(404).send({ message: 'Cannot upload document, Statement not found' })
        return
      }
      // Ensure user has the right to modify it
      if (statement.owner._id.toString() !== user.id) { res.status(401).send({ message: 'Unauthorized, you cannot upload to this statement' }) }

      // Try to save image in DB
      let imageRef
      try {
        imageRef = await ImageService.saveInDB(req.user, docType, req.file)
      } catch (e) {
        res.status(500).send(e)
        return
      }

      // Try to classify Image
      const classifiedImage = await ImageService.classify(req.file, imageRef)

      // Update the statement
      const updatedStatement = await StatementService.attachImageRef(statement, (classifiedImage) || imageRef)

      res.json(updatedStatement)
    })

  return router
}
