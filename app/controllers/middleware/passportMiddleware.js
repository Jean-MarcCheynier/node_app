var userService = require("../../services/userService");

var passportMiddleware = {
	isLoggedIn: function(req, res, next) {
		if (req.isAuthenticated()) 
			return next();

		res.json({authenticated: false})
	},

	isAuthenticated : function(){

	},

	allow: (...roles) => (req, res, next) => {
		if(roles.includes("me")){
			if(req.params && req.params.userId && req.params.userId === req.user._id){
				return next();
			}
		}else if(roles.includes(req.user.role)){
			return next();
		}else{
			res.send(401, 'unauthorized');
		}
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