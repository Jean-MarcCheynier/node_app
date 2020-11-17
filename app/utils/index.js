const errors = require('./errors.js')
const roles = require('./roles.js')
const values = require('./values.js')

module.exports = {
  ...errors,
  ...roles,
  ...values
}
