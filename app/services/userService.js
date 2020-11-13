const User = require('../models/user')

const CLASS = 'userService : '

const UserService = {
  findAll: function (callback) {
    User.find(function (err, data) {
      if (err) {
        return console.error(err)
      }
      return callback(err, data)
    })
  },

  findById: (id ) => User.findById(id),
  findOne: function (args, callback) {
    User.findOne(args, function (err, data) {
      if (err) {
        console.log(CLASS.concat(err))
        throw err
      }
      callback(err, data)
    })
  },
  save: function (data, callback) {
    const user = new User(data)
    console.info(user)
    user.save(function (err, data) {
      if (err) {
        console.log(CLASS.concat("save err :'").concat(err.code).concat("'"))
      } else {
        console.log(CLASS.concat('save succes'))
      }
      callback(err, data)
    })
  },
  update: function (data, callback) {
    delete data.local
    User.findByIdAndUpdate(data._id,
      data,
      {
        new: true,
        strict: true,
        overwrite: false
      },
      (err, updatedData) => {
        if (err) {
          throw err
        }
        callback(err, updatedData)
      }
    )
  },
  deleteAll: function (callback) {
    User.remove({}, function (err, data) {
      if (err) {
        return console.error(err)
      }
      callback(err, data)
    })
  },
  deleteById: function (id, callback) {
    User.findByIdAndRemove(id, function (err, data) {
      if (err) {
        throw err
      }
      callback(err, data)
    })
  },
  accept: function (id, callback) {
    console.log(id)
    User.findByIdAndUpdate(id, { role: 'user' }, callback)
  }
}

module.exports = UserService
