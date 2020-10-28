var AccidentStatement = require('../models/accidentStatement'),

merge = require('merge');

var CLASS = "StatementService : ";  

var StatementService = {
	findByOwnerId: function(ownerId, callback){
		AccidentStatement.find({ownerId: ownerId}, function(err, data){
			if(err){
				return console.error(err);
			}
			callback(err, data);
		});
	},
	
	findById: function(id, callback){
		AccidentStatement.findById(id, function(err, data){
			if(err){
				return console.error(err);
			}
			callback(err, data);
		});
	},

	save: function(data, callback){
		var accidentStatement = new AccidentStatement(data);
		console.info(user);
		accidentStatement.save(function(err, data){
			if(err){
				console.log(CLASS.concat("save err :'").concat(err.code).concat("'"));
			}else{
				console.log(CLASS.concat("save succes"));
			}
			callback(err, data);
		})

	},
	update: function(data, callback){
		delete data.local;
		AccidentStatement.findByIdAndUpdate(data._id,
			data, 
			{ 
				new: true,
				strict: true,
				overwrite: false,
			} , 
			(err, updatedData) => {
				if(err) { 
					throw err; 
				}
				callback(err, updatedData);
			}
		);
	},

	deleteById: function(id, callback){
		AccidentStatement.findByIdAndRemove(id, function (err,data){
    		if(err) { 
    			throw err; 
    		}
    		callback(err, data);
		})
	}
}

module.exports = StatementService;