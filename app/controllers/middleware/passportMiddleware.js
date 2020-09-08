var userService = require("../../services/userService");
const { errors, roles } = require("../../utils")

var passportMiddleware = {

	allow: (..._roles) => (req, res, next) => {
		console.debug("allowing access");
		if(_roles.includes("me")){
			if(req.params && req.params.userId && req.params.userId === req.user._id){
				return next();
			}
		}
		if(_roles.includes(req.user.role)){
			return next();
		}else{
			res.status(401).send(errors[401]);
		}
	},
}

module.exports = passportMiddleware;