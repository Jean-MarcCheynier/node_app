
const Image = require('../models/image')
const ImageRef = require('../models/imageRef')
const { FORM_RECOGNIZER_MODEL_ID, DOC_TYPES } = require('../utils')
const AzureFRService = require('./AzureFormRecognizerService')
const fs = require('fs')

const logger = require('../config/winston')

function sleep (ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

/**
 * Filter File on docType and send it either to the document analyser of AzureFRService
 * Or to the image classification API classifierService
 * @param {*} file
 * @param {*} imageRef
 */
const classify = async (file, imageRef) => {
  logger.info('Classify')
  imageRef.attemptToClassiy = new Date()
  if (!imageRef.documentType) {
    logger.error('Unable to address doc to classification service. No document type provided')
    imageRef.classificationStatus = 'CANNOT'
    return imageRef
  } else {
    switch (imageRef.documentType) {
      case DOC_TYPES.ID_FR:
      case DOC_TYPES.ID_BE:
      case DOC_TYPES.GREEN_CARD:
      case DOC_TYPES.DRIVING_LICENSE:
        logger.debug('2')
        await analyseDocument(imageRef.documentType, file)
          .then(analyze => {
            logger.info('Analyse success')
            imageRef.classification = analyze
            imageRef.classificationStatus = 'SUCCESS'
          })
          .catch(e => {
            logger.error('Analyse Error')
            imageRef.attemptToClassiy = new Date()
            imageRef.classificationStatus = 'FAILED'
          })
        break
      case DOC_TYPES.DAMAGE:
        await classifyDamage(imageRef)
        break
      default:
        imageRef.attemptToClassiy = new Date()
        imageRef.classificationStatus = 'CANNOT'
    }

    const classifiedImageRef = await imageRef.save().then(data => {
      logger.info('Saved with success')
      return data
    })
    return classifiedImageRef
  }
}

const analyseDocument = async (documentType, file) => {
  logger.debug('Running analyseDocument')
  const modelId = FORM_RECOGNIZER_MODEL_ID[documentType]
  if (!modelId) {
    logger.log('error', `Document code does not exist for docType : ${documentType}`)
    throw (new Error({ message: `Document code does not exist for docType : ${documentType}` }))
  }
  const operationLocationURL = await AzureFRService.postFile(modelId, file)
  await sleep(4000)
  const analyze = await AzureFRService.getResult(operationLocationURL)
    .catch(e => {
      logger.log('error', 'Unable to post file to azure form recognizer')
      throw (new Error({ message: 'Unable to post file to azure form recognizer' }))
    })
  logger.info('Analyse OK, ... mapping fields')
  // !No clear if we have only on object here

  const documentResults = (analyze.analyzeResult.documentResults) ? analyze.analyzeResult.documentResults[0] : null
  let data = {}
  if (documentResults) {
    switch (modelId) {
      case FORM_RECOGNIZER_MODEL_ID.ID_FR : {
        const { NOM: name, FIRSTNAME: givenNames, BIRTHDATE: birthDate, NUMBER: nationalId, MRZ1: mrz1, MRZ2: mrz2 } = documentResults.fields
        data = { name, givenNames, birthDate, nationalId, mrz1, mrz2 }
        break
      }
      case FORM_RECOGNIZER_MODEL_ID.ID_BE : {
        const { NOM: name, FIRSTNAME: givenNames, BIRTHDATE: birthDate, 'NATIONAL REGISTRY N': nationalId, 'CARD N': cardNumber, EXPIRE: expiryDate, NATIONALITY: nationality, Sex: sex } = documentResults.fields
        data = { name, givenNames, birthDate, nationalId, cardNumber, expiryDate, nationality, sex }
        break
      }
      case FORM_RECOGNIZER_MODEL_ID.GREEN_CARD : {
        const { Name: fullname, Policy: policy, 'Valid From': validFrom, 'Valid Until': validUntil, 'Vehicle Number': vehicleNumber, Model: vehicleModel, Type: vehicleType } = documentResults.fields
        data = { name, fullname, policy, validFrom, validUntil, vehicleNumber, vehicleModel, vehicleType }
        break
      }
      case FORM_RECOGNIZER_MODEL_ID.DRIVING_LICENSE : {
        const { NOM: name, FIRSTNAME: givenNames, BIRTHDATE: birthDate, 'LICENSE NUMBER': licenseId, 'DELIVERDED ON': deliveredOn, VALIDITY: expiryDate, 'Validity Bis': otherExpiry, MRZ: mrz } = documentResults.fields
        data = { name, givenNames, birthDate, licenseId, deliveredOn, expiryDate, otherExpiry, mrz }
        break
      }
      default :
        break
    }
  }

  return data
}

const classifyDamage = async (file) => {
  return true
}

/**
 * Save Image as Blob
 * @param {*} imageRef
 * @param {*} callback
 */
const saveImgFile = function (imageRef, callback) {
  logger.info('Saving Image in DB')
  const imageData = fs.readFileSync(imageRef.path)
  const contentType = imageRef.mimetype

  // Create an Image instance
  const imageToSave = new Image({
    type: contentType,
    data: imageData
  })
  return imageToSave.save()
    .then(data => {
      try {
        logger.info('Trying to unlink imageRef')
        // fs.unlinkSync(imageRef.path)
      } catch (unlinkError) {
        console.error(unlinkError)
        logger.log('error', 'Error unlink imageRef')
      }
      if (callback) {
        callback(data)
      }
      return data
    })
    .catch(() => {
      logger.log('error', 'Could not save image')
    })
}

const saveImgRef = function (user, imageRef) {
  return ImageRef.create({
    owner: user._id,
    img: imageRef._id,
    mimetype: imageRef.mimetype,
    type: imageRef.type,
    name: imageRef.name,
    documentType: imageRef.documentType,
    classification: imageRef.classification
  }).then(newImageRef => {
    return newImageRef
  }).catch(err => console.error(err))
}

const saveInDB = async (user, docType, imageRef) => {
  logger.prompt('Saving in DB...')
  const newImage = await saveImgFile(imageRef)
    .catch(e => {
      logger.error('Failed to save ImageFile')
      throw Error('Failed to save ImageFile')
    })

  imageRef._id = newImage._id.toString()
  imageRef.documentType = docType
  logger.prompt('Image saved as Blob in DB')
  logger.prompt('Saving imageRef ...')
  const newImageRef = await saveImgRef(user, imageRef)
    .catch(e => {
      throw new Error({ message: 'Failed to save ImageRef' })
    })

  return newImageRef
}

const save = function (user, imageRef, callback) {
  classify(imageRef).then(classifyResponse => {
    console.log('Classify success')
    imageRef.classification = classifyResponse.data.classification
    imageRef.RID = classifyResponse.data.RID
    saveImgFile(imageRef, (imgSaveErr, newImage) => {
      if (imgSaveErr) {
        console.log('Error could not save image')
        return callback()
      } else {
        console.log(classifyResponse.data.message)
        imageRef._id = newImage._id
        saveImgRef(user, imageRef, (refSaveErr, ref) => {
          if (refSaveErr) {
            console.log('Error could not save Ref')
            return callback()
          } else {
            console.log('Ref saved successfuly')
            callback(null, ref)
          }
        })
      }
    })
  }).catch(classificationError => {
    console.log('classification Error')
    return callback(classificationError)
  })
}

const findById = function (imageId, callback) {
  return Image.findById(imageId)
}

const findAll = function (callback) {
  ImageRef.findAll(callback)
}

const findByOwnerId = function (ownerId, callback) {
  ImageRef.find({ owner: ownerId }, callback)
}

const ImageService = {
  saveImgFile,
  saveImgRef,
  saveInDB,
  save,
  findById,
  findAll,
  findByOwnerId,
  classify
}

module.exports = ImageService
