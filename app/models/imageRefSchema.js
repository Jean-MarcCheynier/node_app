var mongoose = require('mongoose');
var ImageRefSchema =  mongoose.Schema({
        name: {type: String},
        documentType: {
            type: String, 
            default: 'other',
            enum: ['idCard', 'inSuranceCard', 'crash', 'drivngLicense', 'other']
        },
        RID: {type: String},
        classification: {type: mongoose.Schema.Types.Mixed },
        owner: mongoose.Schema.Types.ObjectId,
        img: mongoose.Schema.Types.ObjectId,      
        mimeType: { 
            type: String,
            enum: ['image/png', 'image/jpeg'],
        }
    },
    {
        timestamps: { 
            createdAt: 'created_at',
            updatedAt: 'updated_at' 
        }
    });

module.exports = ImageRefSchema;