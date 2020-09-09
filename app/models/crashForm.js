var mongoose = require('mongoose');

var CrashFormSchema = mongoose.Schema({
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    state: {
        type: String, 
        owner: {

        }
    },


    },
    {
    timestamps: {
    }
});


// create the model for users and expose it to our app
var CrashForm = mongoose.model('CrashForm', CrashFormSchema);

module.exports = Image;