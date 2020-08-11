var userService = require("../../services/userService");

var passportMiddleware = {
	isLoggedIn: function(req, res, next) {
		if (req.isAuthenticated()) 
			return next();

		res.json({authenticated: false})
	},

	isAuthenticated : function(){

	},

	isAdmin : function(req, res, next) {
		userService.findById(req.user._id, (user) => {
			if(user.isAdmin){
				next()
			}else{
				res.json({admin: false})
			}
		})

	}
}


module.exports = passportMiddleware;