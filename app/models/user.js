const mongoose = require('mongoose')
const UserSchema = require('./userSchema')

const User = mongoose.model('User', UserSchema)

module.exports = User
