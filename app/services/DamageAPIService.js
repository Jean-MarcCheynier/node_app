
const axios = require('axios')
const logger = require('../config/winston')
const FormData = require('form-data')
const fs = require('fs')

/**
 * Returns a location 'operation-location' in the header
 * @param {*} documentType
 * @param {*} imageRef
 * @returns {Promise<any>}
 */
const postDamage = async (formFile) => {
  const url = process.env.API_DAMAGE_URL
  if (!url) {
    logger.error('URL not present in .env file')
    throw (new Error({ message: 'URL not present in .env file' }))
  }
  const form = new FormData()
  const file = fs.createReadStream(formFile.path)
  form.append('file', file)
  const headers = form.getHeaders()

  return axios.post(url, form, { headers })

    .then(response => {
      logger.info('Image classified with success')
      return response.data
    })
    .catch(e => {
      logger.error('could not classify')
      logger.error(e)
    })
}

const DamageAPIService = {
  postDamage
}

module.exports = DamageAPIService
