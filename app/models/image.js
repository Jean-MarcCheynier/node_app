const mongoose = require('mongoose')
const ImageSchema = mongoose.Schema({
  type: String,
  data: Buffer
})

// create the model for users and expose it to our app
const Image = mongoose.model('Image', ImageSchema)

module.exports = Image
