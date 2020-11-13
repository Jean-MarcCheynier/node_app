'use strict';

var express = require('express');
var router = express.Router();
const multer  = require('multer');
const ImageService = require('../../services/ImageService');
const {allow} = require('../middleware/passportMiddleware');
const StatementService = require('../../services/statementService');



//STORAGE CONFIG TO EXTERNALIZE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/tmp')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix+".png")
    }
})
  
var upload = multer({ storage: storage })

module.exports = function(){
	
	router.route('/')
	.post((req, res) => {
		const userId = req.user.id;
		StatementService.save({owner : userId})
			.then( data =>{
				res.json(data)
			})
			.catch( e => {
				console.error(e)
				res.status(500).send("error")
			})
	})
	.get((req, res) => {
		const userId = req.user.id;
		StatementService.findByOwnerId(userId)
			.then( data => res.json(data))
			.catch( e => res.status(500).send(e))

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
	.put((req, res) => {
		const userId = req.user._id;
		StatementService.update(id, (err, data) => {
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


	router.route('/:statementId/upload/doc/:docType')
	.post(upload.single('file'), async (req, res) => {
		const { docType,  statementId } = req.params;
		console.log(`statementId ${statementId}`)
		const user = req.user;
		if(!statementId){
			res.status(403).send({message: "Param statementId is missing"})
			return
		}
		if(!docType || !["ID_FR", "ID_BE", "GREEN_CARD", "DRIVING_LICENSE", "DAMMAGE"].includes(docType))
			res.status(403).send({message: "Param docType is missing"})
		if(!req.file)
			res.status(403).send({message: "File is missing"})
		
		let statement;
		try {
			statement = await StatementService.findById(statementId)
		} catch( e ) {
			res.status(404).send({message: "Cannot upload document, Statement not found"})
			return
		}
			
		if(statement.owner._id.toString() !== user.id)
			res.status(401).send({message: "Unauthorized, you cannot upload to this statement"});
		let imageRef
		try {
			imageRef = await ImageService.saveInDB(req.user, docType, req.file)
		} catch ( e ) {
			res.status(500).send(e)
			return
		}
		let classifiedImage;
		try {
			classifiedImage = await ImageService.classify(imageRef)
		} catch( e ) {
			console.log("Error durring classification")
		}
		let updatedStatement
		try {
			updatedStatement = await StatementService.attachImageRef(statement, (classifiedImage)?classifiedImage:imageRef);
		} catch ( e ) {
			res.status(500).send(e);
		}

		res.json(updatedStatement)


	})

	return router;
}