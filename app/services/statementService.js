'use strict'

const { DOC_TYPES } = require('../utils')
const logger = require('../config/winston')

const AccidentStatement = require('../models/accidentStatement')

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
    default:
      logger.error(`Cannot attach document type ${imageRef.documentType}`)
      throw (new Error({ message: 'Cannot attach document' }))
  }

  const newStatement = await statement.save().then(data => {
    logger.prompt('Statement updated with new image')
    return data
  })
  const result = await newStatement.populate('driverA.idCard').execPopulate()
  return result
}

const findByOwnerId = (ownerId) => AccidentStatement.find({ owner: ownerId })
const findById = (id) => AccidentStatement.findById(id)
const save = (data) => {
  const accidentStatement = new AccidentStatement(data)
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
  save,
  deleteById
}

module.exports = StatementService
