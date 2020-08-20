var JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt,
config = require("./environment");

// load up the user model
var UserService = require('../services/userService');


module.exports = function(passport) {   
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
    opts.secretOrKey = config.secrets.jwt;
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        UserService.findById(jwt_payload._id, function(err, user) {
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};