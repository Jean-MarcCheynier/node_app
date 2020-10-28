const express = require('express');
const {allow} = require('../middleware/passportMiddleware');
const StatementService = require('../../services/statementService');
const router = express.Router();

module.exports = function(){
	
	router.route('/')
	.post((req, res) => {
		const userId = req.user._id;
		StatementService.save({ownerId : userId}, (err, data) => {
			res.json(data)
		});
	})
	.get((req, res) => {
		const userId = req.user._id;
		StatementService.findByOwnerId(userId, (err, data) => {
			res.json(data)
		});

	});

	router.route('/:id')
	.get((req, res) => {
		const userId = req.user._id;
		StatementService.findByOwnerId(id, (err, data) => {
			if(err){

			}else{
				if(data.ownerId === userId){
					res.json(data);
				}else{
					res.status(401);
				}
			}
		})
	})
}