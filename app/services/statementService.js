'use strict'

const { DOC_TYPES } = require('../utils')
const logger = require('../config/winston')

const AccidentStatement = require('../models/accidentStatement')

const StatementService = {

  attachImageRef: async (statement, imageRef) => {
    switch (imageRef.documentType) {
      case DOC_TYPES.ID_FR:
      case DOC_TYPES.ID_BE:
        if (statement.driverA) {
          console.log('DriverA present')
          statement.driverA.idCard.push(imageRef._id)
        } else {
          console.log('DriverA not present')
          statement.driverA = { idCard: [imageRef._id] }
        }
        break
      default:
        logger.log('error', 'Cannot attach imageRef to statement, Invalid documentType')
        throw (new Error({ message: 'Cannot attach document' }))
    }

    const newStatement = await statement.save()
    // Populate it with the idCards
    await newStatement.populate('driverA.idCard').execPopulate()
    return newStatement
  },
  findByOwnerId: (ownerId) => AccidentStatement.find({ owner: ownerId }),
  findById: (id) => AccidentStatement.findById(id),
  save: (data) => {
    const accidentStatement = new AccidentStatement(data)
    return accidentStatement.save(data)
  },
  /**
  * TODO: Secure this route
  * @param {*} id
  * @param {*} callback
  */
  deleteById: (id, callback) => AccidentStatement.findByIdAndRemove(id)
}

module.exports = StatementService
