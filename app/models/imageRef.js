const mongoose = require('mongoose')
const ImageRefSchema = require('./imageRefSchema')

const ImageRef = mongoose.model('ImageRef', ImageRefSchema)

module.exports = ImageRef
