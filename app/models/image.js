var mongoose = require('mongoose');
var ImageSchema =  mongoose.Schema({
    type: String,
    data: Buffer
});


// create the model for users and expose it to our app
var Image = mongoose.model('Image', ImageSchema);

module.exports = Image;