var mongoose = require('mongoose'),
UserSchema = require('./userSchema');



// create the model for users and expose it to our app
var User = mongoose.model('User', UserSchema);

module.exports = User;