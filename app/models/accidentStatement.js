const mongoose = require('mongoose')

const DriverSchema = mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  natioanlity: { type: String },
  nationalID: { type: String },
  phone: { type: String },
  email: { type: String },
  greenCard: {
    imageRef: { type: mongoose.Schema.ObjectId, ref: 'ImageRef' },
    info: { type: mongoose.Mixed }
  },
  idCard: {
    imageRef: { type: mongoose.Schema.ObjectId, ref: 'ImageRef' },
    info: { type: mongoose.Mixed }
  },
  drivingLicense: {
    imageRef: { type: mongoose.Schema.ObjectId, ref: 'ImageRef' },
    info: { type: mongoose.Mixed }
  }
})

const DamageSchema = mongoose.Schema({
  images: [{ type: mongoose.Schema.ObjectId, ref: 'ImageRef' }]
})

const AccidentStatementSchema = mongoose.Schema({
  status: { type: String, enum: ['new', 'pending', 'review', 'complete'] },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
  driverA: { type: DriverSchema },
  driverB: { type: DriverSchema },
  damage: { type: DamageSchema }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

// create the model for users and expose it to our app
const AccidentStatement = mongoose.model('AccidentStatement', AccidentStatementSchema)

module.exports = AccidentStatement
