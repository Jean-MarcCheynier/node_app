/**
 * Main application routes
 */

 'use strict';

var errors = require('./components/errors');
var path = require('path');

module.exports = function(app, passport) {
	app.all('/', function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "X-Requested-With");
		next();
	   });
	// Secure api routes
	app.all('/api/*', passport.authenticate('jwt', { session: false}));

	// Insert routes below
	app.use('/api/user', require('./controllers/private/userController')());

	// Default routes
	app.use('/', require('./controllers/public/index')());


	// All undefined asset or api routes should return a 404
 	app.route('/:url(api|auth|components|app|bower_components|assets)/*')
	.get(errors[404]);

};
