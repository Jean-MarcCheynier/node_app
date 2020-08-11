var mongoose = require("mongoose");

var userGroupSchema = mongoose.Schema({
	name: String,
	author: {type : mongoose.Schema.ObjectId, ref: 'User'},
	tempmates: [{type : mongoose.Schema.ObjectId, ref: 'User'}],
	mates: [{type : mongoose.Schema.ObjectId, ref: 'User'}]
});

var UserGroup = mongoose.model('UserGroup', userGroupSchema);

module.exports = UserGroup;