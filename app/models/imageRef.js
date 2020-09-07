var mongoose = require('mongoose');
var ImageRefSchema =  mongoose.Schema({
        name: {type: String},
        type: {
            type: String, 
            default: 'other',
            enum: ['idCard', 'inSuranceCard', 'crash', 'drivngLicense', 'other']
        },
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


var ImageRef = mongoose.model('ImageRef', ImageRefSchema);

module.exports = ImageRef;