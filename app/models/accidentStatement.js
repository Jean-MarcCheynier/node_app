const mongoose = require('mongoose')

const DriverSchema = mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  natioanlity: { type: String },
  nationalID: { type: String },
  phone: { type: String },
  email: { type: String },
  greenCard: {
    required: { type: Boolean, default: true },
    imageRef: { type: mongoose.Schema.ObjectId, ref: 'ImageRef' }
  },
  idCard: {
    required: { type: Boolean, default: true },
    imageRef: { type: mongoose.Schema.ObjectId, ref: 'ImageRef' }
  },
  drivingLicense: {
    required: { type: Boolean, default: true },
    imageRef: { type: mongoose.Schema.ObjectId, ref: 'ImageRef' }
  },
  damages: {
    required: { type: Boolean, default: true },
    imageRefArray: [{ type: mongoose.Schema.ObjectId, ref: 'ImageRef' }]
  }
})

const AccidentStatementSchema = mongoose.Schema({
  status: { type: String, enum: ['new', 'pending', 'review', 'complete'] },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
  driverA: { type: DriverSchema },
  driverB: { type: DriverSchema }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

// create the model for users and expose it to our app
const AccidentStatement = mongoose.model('AccidentStatement', AccidentStatementSchema)
const Driver = mongoose.model('Driver', DriverSchema)

module.exports = { AccidentStatement, Driver }
