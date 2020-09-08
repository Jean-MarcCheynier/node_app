var mongoose = require("mongoose"),
bcrypt   = require('bcrypt-nodejs');
// define the schema for our user model
var userSchema = mongoose.Schema({
		signedIn: {type: Date},
		role: {
			type: String,
			enum: ['user', 'insurer', 'pre', 'admin'],
			default: 'pre'
		},
		lang: {type: String, default: 'fr'},
		name: { type: String, unique: false, required: false },
		email: { type: String, unique: false, required: false },
		local: {
			login: { type: String, unique: true, required : true  },
			password: { type: String , required: true },
		}
	},
	{ 
		timestamps: { 
			createdAt: 'created_at',
			updatedAt: 'updated_at' 
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
	delete obj.facebook;
	delete obj.twitter;
	delete obj.google;

	return obj;
}

module.exports = userSchema;