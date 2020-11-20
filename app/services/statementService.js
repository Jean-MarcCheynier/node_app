'use strict'

const { DOC_TYPES } = require('../utils')
const logger = require('../config/winston')

const { AccidentStatement, Driver } = require('../models/accidentStatement')

const attachImageRef = async (statement, imageRef, driver = 'driverA') => {
  logger.prompt('Attaching classified image to statement form')
  switch (imageRef.documentType) {
    case DOC_TYPES.ID_FR:
    case DOC_TYPES.ID_BE:
      if (statement[driver]) {
        statement[driver].idCard.imageRef = imageRef._id
      } else {
        statement[driver] = {
          idCard: { imageRef: imageRef._id }
        }
      }
      break
    case DOC_TYPES.GREEN_CARD:
      if (statement[driver]) {
        statement[driver].greenCard.imageRef = imageRef._id
      } else {
        statement[driver] = {
          greenCard: { imageRef: imageRef._id }
        }
      }
      break
    case DOC_TYPES.DRIVING_LICENSE:
      if (statement[driver]) {
        statement[driver].drivingLicense.imageRef = imageRef._id
      } else {
        statement[driver] = {
          drivingLicense: { imageRef: imageRef._id }
        }
      }
      break
    case DOC_TYPES.DAMAGE:
      statement[driver].damages.imageRefArray.push(imageRef._id)
      break
    default:
      logger.error(`Cannot attach document type ${imageRef.documentType}`)
      throw (new Error({ message: 'Cannot attach document' }))
  }

  const updatedStatement = await statement.save().then(data => {
    logger.prompt('Statement updated with new image')
    return data
  })
  const result = await updatedStatement
    .populate('driverA.idCard.imageRef')
    .populate('driverA.greenCard.imageRef')
    .populate('driverA.drivingLicense.imageRef')
    .populate('driverA.damages.imageRefArray')
    .populate('driverB.idCard.imageRef')
    .populate('driverB.greenCard.imageRef')
    .populate('driverB.drivingLicense.imageRef')
    .populate('driverB.damages.imageRefArray')
    .execPopulate()
  return result
}

const findByOwnerId = (ownerId) => AccidentStatement
  .find({ owner: ownerId })
  .populate('driverA.idCard.imageRef')
  .populate('driverA.greenCard.imageRef')
  .populate('driverA.drivingLicense.imageRef')
  .populate('driverA.damages.imageRefArray')
  .populate('driverB.idCard.imageRef')
  .populate('driverB.greenCard.imageRef')
  .populate('driverB.drivingLicense.imageRef')
  .populate('driverB.damages.imageRefArray')

const findById = (id) => AccidentStatement
  .findById(id)
  .populate('driverA.idCard.imageRef')
  .populate('driverA.greenCard.imageRef')
  .populate('driverB.idCard.imageRef')
  .populate('driverA.drivingLicense.imageRef')
  .populate('driverB.greenCard.imageRef')
  .populate('driverB.drivingLicense.imageRef')

const initStatement = (data) => {
  const driverA = new Driver()
  const driverB = new Driver()

  const accidentStatement = new AccidentStatement({ driverA, driverB, ...data })
  return accidentStatement.save(data)
}
/**
* TODO: Secure this route
* @param {*} id
* @param {*} callback
*/
const deleteById = (id, callback) => AccidentStatement.findByIdAndRemove(id)

const StatementService = {
  attachImageRef,
  findByOwnerId,
  findById,
  initStatement,
  deleteById
}

module.exports = StatementService
