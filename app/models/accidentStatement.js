var mongoose = require('mongoose');


var DriverSchema = mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    natioanlity: {type: String},
    nationalID: {type: String},
    phone: {type: String},
    email: {type: String},
    greenCard: [{type : mongoose.Schema.ObjectId, ref: 'ImageRef'}],
    idCard: [{type : mongoose.Schema.ObjectId, ref: 'ImageRef'}],
    drivingLicense: [{type : mongoose.Schema.ObjectId, ref: 'ImageRef'}]
});

var DamageSchema = mongoose.Schema({
    images: [{type : mongoose.Schema.ObjectId, ref: 'ImageRef'}]
});

var AccidentStatementSchema =  mongoose.Schema({
    owner: { type : mongoose.Schema.ObjectId, ref: 'User'},
    driverA: { type: DriverSchema },
    driverB: { type: DriverSchema },
    damage: { type: DamageSchema }
},
{
    timestamps: { 
        createdAt: 'created_at',
        updatedAt: 'updated_at' 
    }
});


// create the model for users and expose it to our app
var AccidentStatement = mongoose.model('AccidentStatementSchema', AccidentStatementSchema);

module.exports = AccidentStatement;