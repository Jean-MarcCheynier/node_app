var UserGroup = require('../models/userGroup'),
_ =             require('lodash');
const CLASS =			"userGroupService : ";


var UserGroupService = {
	findAll: function(userId, callback){
		UserGroup.find({mates: userId}).populate('mates').populate('tempmates').exec(function(err, data){
			if(err){
				return console.error(err);
			}	
			callback(err, data);
		});
	},
	findById: function(id, callback){
		UserGroup.findById(id, function(err, data){
			if(err){
				return console.error(err);
            }
			callback(err, data);
		});
	},
	save: function(data, userId, callback){
        console.log(CLASS.concat("SAVING USERGROUP"));
        console.log(userId)
        userGroup = new UserGroup();
        userGroup.author = userId;
        userGroup.mates.push(userId);
        userGroup.name = data.name;
        userGroup.save(function(err, savedData){
            if(err){
                console.error("ERREUR de SAUVEGARDE");
            }
            UserGroup.populate(savedData, {path:"mates"}, function(err, userGroup) { 
                callback(err, userGroup); 
            });
        })
	},
	update: function(id, data, callback){
		UserGroup.updateOne({"_id": id}, data, function(err, data){
    		if(err) { 
    			throw err; 
    		}
			callback(err, data);
		});
	},
	deleteAll: function(userId, callback){
		UserGroup.remove({ user: userId}, function(err, data){
			if(err){
				return console.error(err);
			}
			callback(err, data);
		})
	},
	deleteById: function(id, callback){
		UserGroup.findByIdAndRemove(id, function (err,data){
    		if(err) { 
    			throw err; 
    		}
    		callback(err, data);
		})
	},
	join: function(userGroupId, userId, callback){
        console.log(CLASS.concat("join group"));
        UserGroup.findById(userGroupId, function (err, usergroup){
    		if(err) { 
                console.log(CLASS.concat("err"));
                throw err; 
            }
            if(usergroup.mates.indexOf(userId)==-1){
				console.log(CLASS.concat("add to group"));
				usergroup.mates.push(userId);
                usergroup.save(callback);
            }else{
				console.log(CLASS.concat("user already in group"));
				callback("err","");
			}

		})
    },
    signout: function(id, callback){
        console.log(CLASS.concat("signout"));
        UserGroup.findById(id, function (err, usergroup){
    		if(err) { 
                console.log(CLASS.concat("err"));
                throw err; 
            }
            console.log(CLASS.concat("founded"));
            var _mates = [];
            for(var i = 0; i< _mates.length; i++){
                if(usergroup[i]!=id){
                    console.log(CLASS.concat("MATES"));
                    _mates.push(usergroup.mates[i]);
                }
            }
            usergroup.mates =_mates;

            if(usergroup.mates.length== 0){
                console.log(CLASS.concat("remove"));
                UserGroup.findByIdAndRemove({_id: usergroup._id}, callback);
            }else{
                console.log(CLASS.concat("save")); 
                usergroup.save(callback);
            }
		})
    }
}

module.exports = UserGroupService;