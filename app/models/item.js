var mongoose = require('mongoose');

var ItemSchema = mongoose.Schema({
	dateCreate: {type: Date, default: Date.now},
	name: { type : String, unique : false, required : false },

});

// create the model for users and expose it to our app
var Item = mongoose.model('Item', ItemSchema);

module.exports = Item;