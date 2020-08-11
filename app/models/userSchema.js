var mongoose = require("mongoose"),
bcrypt   = require('bcrypt-nodejs');
// define the schema for our user model
var userSchema = mongoose.Schema({
	
	dateCreate: {type: Date, default: Date.now},
	signedIn: [Date],
	role: {
		type: String,
		enum: ['user', 'pre', 'admin'],
		default: 'pre'
	},
	lang: {type: String, default: 'fr'},
	local            : {
		name         : { type : String, unique : true, required : true },
		email        : { type : String, unique : false, required : false  },
		password     : { type : String , required : true },
	}
});

// Enregistrement de l'utilisateur (toujours hasher les mots de passe en production) 
userSchema.pre('save', function (next) {  
	var user = this;
	if (this.isModified('local.password') || this.isNew) {
		bcrypt.genSalt(10, (err, salt) => {
			if (err) { return next(err); }

			bcrypt.hash(user.local.password, salt, null, function(err, hash) {
				if (err) {
					console.log("error");
					return next(err);
				}
				user.local.password = hash;
				next();
			});
		});

	} else {
		return next();
	}
});

// Comparaison des mots de passes reçus et en base
userSchema.methods.comparePassword = function(pw, cb) {
	console.log(pw);
	console.log(this.local.password);
	bcrypt.compare(pw, this.local.password, function(err, isMatch) {
		console.log("callback");	
	  	if (err) {
			return cb(err);
	  	}
	  	cb(null, isMatch);
	});
};

userSchema.methods.toJSON = function() {
	var obj = this.toObject();
	delete obj.local.password;
	delete obj.local.email;
	delete obj.facebook;
	delete obj.twitter;
	delete obj.google;

	return obj;
}

module.exports = userSchema;