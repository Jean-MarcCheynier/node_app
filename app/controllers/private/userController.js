'use strict';

const CLASS = "UserController : "

var express = require('express'),
UserService = require('../../services/userService'),
router = express.Router();

module.exports = function(){
	
	//Get all users
	router.route('/')
	.get(function (req, res) {
		UserService.findAll(
			function(err, data){res.json(data)}
		);
	});
	
	//Get, Put (modify), Delete a user
	router.route('/:id')
	.get(function (req, res) {
		UserService.findById(req.params.id,
			function(err, data){
				res.json(data)
			}
		);
	})
	.put(function(req, res) {
		UserService.update(req.body,
			function(err, data){res.json(data)}
		);
	})
	.delete(function(req, res) {
		UserService.deleteById(req.params.id,
			function(err, data){res.json(data)}
		);
	});

	router.route('/password/reset')	
	.post(function(req, res){
		if(req.user._id != req.body._id)
			res.send(401, 'unauthorized');
		UserService.update(req.body, (err, data)=>{
			res.json(data);
		})
	});

	return router
}