const mongoose = require('mongoose')

const userGroupSchema = mongoose.Schema({
  name: String,
  author: { type: mongoose.Schema.ObjectId, ref: 'User' },
  tempmates: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  mates: [{ type: mongoose.Schema.ObjectId, ref: 'User' }]
})

const UserGroup = mongoose.model('UserGroup', userGroupSchema)

module.exports = UserGroup
