const mongoose = require('mongoose')
const ImageRefSchema = mongoose.Schema({
  name: { type: String },
  documentType: {
    type: String,
    default: 'other',
    enum: ['ID_FR', 'ID_BE', 'GREEN_CARD', 'DRIVING_LICENSE', 'DAMAGE', 'other']
  },
  RID: { type: String },
  attemptToClassiy: { type: Date },
  classificationStatus: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANNOT'], default: 'PENDING' },
  classification: { type: mongoose.Schema.Types.Mixed },
  owner: mongoose.Schema.Types.ObjectId,
  img: mongoose.Schema.Types.ObjectId,
  mimeType: {
    type: String,
    enum: ['image/png', 'image/jpeg']
  }
},
{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = ImageRefSchema
