
const FormData = require('form-data')
const fs = require('fs')
const axios = require('axios')
const logger = require('../config/winston')

/**
 * Returns a location 'operation-location' in the header
 * @param {*} documentType
 * @param {*} imageRef
 * @returns {Promise<any>}
 */
const postFile = async (modelId, imageRef) => {
  const SUBSCRIPTION_KEY = process.env.AZURE_FORM_RECOGNIZER_KEY
  if (!SUBSCRIPTION_KEY) {
    logger.error('AZURE_FORM_RECOGNIZER_KEY missing in env variables')
    throw (new Error({ message: 'Cannot access azure form recognizer. No API key provided' }))
  }
  const azureFCBaseUrl = process.env.AZURE_FORM_RECOGNIZER_URL
  if (!azureFCBaseUrl) {
    logger.error('AZURE_FORM_RECOGNIZER_URL missing in env variables')
    throw (new Error({ message: 'Cannot access azure form recognizer. No url provided' }))
  }
  const URL = `${azureFCBaseUrl}/custom/models/${modelId}/analyze`
  const form = new FormData()
  form.append('name', 'image')

  const imageData = fs.readFileSync(imageRef.path)
  const headers = {
    'Content-type': 'image/jpeg',
    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY
  }
  return axios.post(URL, imageData, { headers })
    .then(response => response.headers['operation-location'])
    .catch( e => {
      logger.error('Could not post file to Azure Form Recognizer')
    })
}

const getResult = async (operationLocationURL) => {
  const SUBSCRIPTION_KEY = process.env.AZURE_FORM_RECOGNIZER_KEY
  if (!SUBSCRIPTION_KEY) {
    logger.error('AZURE_FORM_RECOGNIZER_KEY missing in env variables')
    throw (new Error({ message: 'Cannot access azure form recognizer. No API key provided' }))
  }

  const headers = {
    'Content-type': 'application/json',
    'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY
  }
  return axios.get(operationLocationURL, { headers })
    .then(response => {
      logger.debug('Retreived successfully')
      logger.debug(response)
      return response
    })
    .catch( e => {
      logger.error('Could not retreive operation from Azure Form Recognizer')
    })
}

const AzureFormRecognizerService = {
  postFile,
  getResult
}

module.exports = AzureFormRecognizerService
