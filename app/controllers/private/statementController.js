'use strict'

const express = require('express')
const router = express.Router()
const multer = require('multer')
const ImageService = require('../../services/ImageService')
const StatementService = require('../../services/statementService')
const PDFService = require('../../services/PDFService')
const fs = require('fs')
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
      StatementService.initStatement({ owner: userId })
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
  router.route('/:statementId/pdf')
    .get(async (req, res) => {
      const { statementId } = req.params
      // const userId = req.user._id

      if (!statementId) {
        logger.error('Missing parameter \'statementId\'')
        res.status(403).send({ message: 'Param statementId is missing' })
      }

      const statement = await StatementService.findById(statementId).catch(e => {
        logger.error(`Missing statement with Id : ${statementId}`)
        res.status(500).send({ message: 'could not find the required statement to generate pdf' })
      })
      try {
        logger.debug('starting pdf generation')
        const temp = PDFService.generate(statement, statementId)
        await temp.then((file) => {
          logger.debug(fs.existsSync(file))
          logger.info(`sending pdf for request ${statementId}`)
          fs.readFile(file, 'base64', function (err, data) {
            if (err) throw err
            res.status(200).json({
              status: 'success',
              data: data
            })
          })
        })
      } catch (error) {
        console.error(error)
        res.status(500).send({ message: `error ${error} while generating pdf` })
      }
    })

  router.route('/:statementId/upload/doc/:docType')
    .post(upload.single('file'), async (req, res) => {
      const { docType, statementId } = req.params
      const { documentType, driver } = req.body
      logger.prompt(`Doctype : ${documentType} : ${driver}`)
      const user = req.user
      logger.info(`Upload docType : ${docType} in statement ${statementId}`)

      if (!statementId) {
        logger.error('Missing parameter \'statementId\'')
        res.status(403).send({ message: 'Param statementId is missing' })
        return
      }
      if (!docType || !['ID_FR', 'ID_BE', 'GREEN_CARD', 'DRIVING_LICENSE', 'DAMAGE'].includes(docType)) {
        logger.error('Missing parameter \'docType\'')
        res.status(403).send({ message: 'Missing parameter \'docType\'' })
      }
      if (!req.file) {
        logger.error('Missing file in request \'File\'')
        res.status(403).send({ message: 'File is missing' })
      }

      const statement = await StatementService.findById(statementId)
        .catch(e => {
          logger.error('Cannot upload document to statement. Statement not found')
          res.status(404).send({ message: 'Cannot upload document, Statement not found' })
        })

      if (statement.owner._id.toString() !== user.id) {
        logger.error('Unauthorized, insufficient permission to access this statement')
        res.status(401).send({ message: 'Unauthorized, you cannot upload to this statement' })
      }

      const imageRef = await ImageService.saveInDB(req.user, docType, req.file)
        .catch(e => {
          logger.error('Failed to store image in DB')
          res.status(500).send(e)
        })

      const classifiedImage = await ImageService.classify(req.file, imageRef)
        .catch(e => {
          logger.error('Failed to classify')
          res.status(500).send(e)
        })

      const updatedStatement = await StatementService.attachImageRef(statement, (classifiedImage) || imageRef, driver)
        .catch(e => {
          logger.error('Failed to attach image to statement')
          res.status(500).send(e)
        })

      res.json(updatedStatement)
    })

  return router
}
