var mongoose = require('mongoose');
var ImageRefSchema =  require('./imageRefSchema');

var ImageRef = mongoose.model('ImageRef', ImageRefSchema);

module.exports = ImageRef;