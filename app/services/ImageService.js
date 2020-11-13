
const Image = require('../models/image');
const ImageRef = require('../models/imageRef');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require("fs");
const request = require('request');
const axios = require('axios');
const { values } = require("..//utils")

var url = require('url');
var https = require('https');
var HttpsProxyAgent = require('https-proxy-agent');
const { O_CREAT } = require('constants');


const CLASS = "imageService : ";

const classify = async imageRef => {
	if(!imageRef.documentType){
		console.error("Unable to address doc to classification service. No document type provided")
		imageRef.attemptToClassiy = new Date();
		imageRef.classificationStatus = "CANNOT";
		return imageRef;
	}else{
		let classification;
		switch(imageRef.documentType) {
			case "ID_FR": 
			case "ID_BE":
			case "GREEN_CARD":
			case "DRIVING_LICENSE":
				try {
					classification = await postToFormRecognizer(imageRef)
				} catch(e) {
					imageRef.attemptToClassiy = new Date();
					imageRef.classificationStatus = "FAILED";
				}
				break;
			case "DAMMAGE":
				try {
					classification = await dammageRecogniser(imageRef);
				} catch(e) {
					imageRef.attemptToClassiy = new Date();
					imageRef.classificationStatus = "FAILED";
				}
				break;
			default:
				imageRef.attemptToClassiy = new Date();
				imageRef.classificationStatus = "CANNOT";
		}
		return imageRef;
	}
}

const postToFormRecognizer = async (imageRef) => {
	const MODELID = values.formRecognizerModels[imageRef.documentType]
	const SUBSCRIPTION_KEY = 'e6b14e091bc845149c7613b767f6d017'
	console.log(`MODELID ${MODELID}`);
	const URL = `https://dxsformrecognizer.cognitiveservices.azure.com/formrecognizer/v2.1 -preview.1/custom/models/${MODELID}/analyze`;
	console.log("Creation of a form");
	const form = new FormData();
	form.append('name', 'image');
	const file = fs.createReadStream(imageRef.path);
	form.append('file', file);
	const headers = {
		...form.getHeaders(),
		'Content-type': 'image/jpeg',
		'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY
	}
	return axios.post(URL, form, { headers: {...form.getHeaders()}  });
}

/**
 * Save Image as Blob
 * @param {*} imageRef 
 * @param {*} callback 
 */
const saveImgFile = function(imageRef, callback){
	console.log("saving file");
	var imageData = fs.readFileSync(imageRef.path);
	var contentType = imageRef.mimetype;

	// Create an Image instance
	console.log("Creating image instance");
	const imageToSave = new Image({
		type: contentType,
		data: imageData
	});
	return imageToSave.save()
		.then(data => {
			try {
				console.log("Trying to unlink imageRef");
				//fs.unlinkSync(imageRef.path)

			} catch(unlinkError) {
				console.error(unlinkError)
				console.log("Error unlink imageRef");
			}
			if(callback){
				callback(err, data);
			}
			return data
		})
		.catch( err => {
				console.log("Error saving image");
		})
};


const saveImgRef = function(user, imageRef, callback){
	return ImageRef.create({
		owner: user._id,
		img: imageRef._id,  
		mimetype: imageRef.mimetype,
		type: imageRef.type,
		name: imageRef.name,
		documentType: imageRef.documentType,
		classification: imageRef.classification
	}).then( newImageRef => {
		if(callback) {
			callback(err, newImageRef);
		}
		return newImageRef
	}).catch( err => console.error(err))
};

const saveInDB = async (user, docType, imageRef) => {
	console.log(`saving new ${docType} in DB...`);
	let newImage;
	try {
		newImage = await saveImgFile(imageRef);
	} catch( e ) {
		console.log("Failed to save ImageFile")
		throw({message: "Failed to save ImageFile"})
	}

	console.log("Image File saved")
	imageRef._id = newImage._id.toString();
	imageRef.documentType = docType;

	console.log("Saving imageRef")
	let newImageRef;
	try {
		newImageRef = await saveImgRef(user, imageRef)
	} catch ( e ) {
				console.log("Failed to save imageRef")
				throw({message: "Failed to save ImageRef"})
	}
	console.log("Saved ImageRef in DB");
	return newImageRef;
}

const save = function(user, imageRef, callback){
	classify(imageRef).then(classifyResponse => {
		console.log("Classify success");
		imageRef.classification = classifyResponse.data.classification;
		imageRef.RID = classifyResponse.data.RID
		saveImgFile(imageRef, (imgSaveErr, newImage) => {
			if(imgSaveErr){
				console.log("Error could not save image");
				return callback(err);
			}else{
				console.log(classifyResponse.data.message);
				imageRef._id = newImage._id
				saveImgRef(user, imageRef, (refSaveErr, ref) => {
					if(refSaveErr){
						console.log("Error could not save Ref");
						return callback(err);
					}else{
						console.log("Ref saved successfuly");
						callback(null, ref);
					}
				});
			}
		})
	}).catch(classificationError => {
		console.log("classification Error");
		return callback(classificationError);
	})
}

const findById = function(imageId, callback){
	Image.findById(imageId, function(err, data){
		if(err){
			return console.error(err);
		}
		callback(err, data);
	});
};

const findAll = function(callback){
	ImageRef.findAll(callback);
}

const findByOwnerId = function(ownerId, callback){
	ImageRef.find({owner: ownerId}, callback);
}

var ImageService = {
	saveImgFile,
	saveImgRef,
	saveInDB,
	save,
	findById,
	findAll,
	findByOwnerId,
	classify
}

module.exports = ImageService;