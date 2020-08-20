'use strict';

const CLASS = "UserController : "

const express = require('express');
const {allow} = require('../middleware/passportMiddleware');
const UserService = require('../../services/userService');
const router = express.Router();

module.exports = function(){
	
	router.route('/')
	.get(function (req, res) {
		UserService.findAll(
			function(err, data){
				res.json(data)
			}
		);
	});
	
	router.route('/:userId')
	.get(allow('me', 'admin'), function (req, res) {
		UserService.findById(req.params.userId,
			function(err, data){
				res.json(data)
			}
		);
	})
	.put(allow('me', 'admin'), function(req, res) {
		UserService.update(req.body,
			function(err, data){
				res.json(data)
			}
		);
	})
	.delete(allow('me', 'admin'), function(req, res) {
		UserService.deleteById(req.params.id,
			function(err, data){
				res.json(data)
			}
		);
	});

	router.route('/:userId/accept')
	.post(allow('admin'), function(req, res) {
		UserService.accept(req.body, (err, data) => res.json(data));
	});

	router.route('/password/reset')	
	.post(function(req, res){
		if(req.user._id != req.body._id)
			res.send(401, 'unauthorized');
		UserService.update(req.body, (err, data) => {
			res.json(data);
		})
	});

	return router
}