const util = require('util')
const pdfFiller = require('pdffiller')
const fs = require('fs')
const path = require('path')
const StatementFlattenService = require('./statementFlattenService')
const logger = require('../config/winston')

const fillFormWithFlatten = util.promisify(pdfFiller.fillFormWithFlatten.bind(pdfFiller));
const currentPath = process.cwd()

const sourcePDF = path.join(currentPath, 'public', 'European-Accident-Statement_form.pdf')


/**
 * TODO : if file at path is older than file online, download and replace file
 * options (not exhaustive) : check last modified at each generation, check once every X, force replace every X 
 * @param {string} path
 */
const checkValidity = (path) =>{
  if (fs.existsSync(path)) {
    return true
  } else {
    return false
  }
}


/**
 * using the fiels from statement , fill the template pdf and store it 
 * @param {AccidentStatementSchema} statement 
 */
async function generate (statement, id) {
  // template = check_validity(sourcePDF)
  if (!fs.existsSync(sourcePDF)) {
    logger.debug(`error or path to source with cwd = ${currentPath}`)
  }

  const destinationPDF = path.join(currentPath, 'public', 'tmp', `${id}.pdf`)
  const flattenData = StatementFlattenService.flatten(statement)
  logger.debug(`flatten data =${JSON.stringify(flattenData)}`)
  await fillFormWithFlatten(sourcePDF, destinationPDF, flattenData, false);
  return destinationPDF
}

/**
 * fills a statement using the corrections comming from the user
 * @param {*} statement 
 */
const complete = (statement) => {

}

const PDFService = {
  generate,
  complete
}

module.exports = PDFService
