
const Image = require('../models/image');
const ImageRef = require('../models/imageRef');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require("fs");
const request = require('request');
const axios = require('axios');
const { values } = require("../utils")

const { O_CREAT } = require('constants');

const formRecognizerCodes = {
  "ID_FR":"df59ec7e-b341-4fc7-9d12-d3911a958619",
  "ID_BE":"7c8b063b-423c-49a0-8de9-5e8207989a64",
  "GREEN_CARD_STICKER":"4a271819-31d4-434b-8e96-98636ecace67",
  "GREEN_CARD":"55ae359d-569c-47eb-a72c-63fe5489e098",
  "DRIVING_LICENSE":"aa49cd75-acd4-482e-aba6-69f6b942a17a"
} 


const CLASS = "imageService : ";

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
} 

const classify = async (file, imageRef) => {
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

				console.log("Classify formRecognizer");
				const {documentType} = imageRef

				const operationLocation = await postToFormRecognizer(documentType, file)
					.then( response => {
						// Return the location of the resource
						console.log("POST SUCCESS");
						return response.headers["operation-location"]
					})
					.catch( e => {
						console.log(e);
						console.log("Form RecognizerError : Failed to post image")
						imageRef.attemptToClassiy = new Date();
						imageRef.classificationStatus = "FAILED";
					})

				if(operationLocation){
					console.log(operationLocation);
					await sleep(5000);
					console.log("Return")
					classification = await getOperationFormRecognizer(operationLocation);
					console.log(classification)
					imageRef.classification = classification
					imageRef.attemptToClassiy = new Date();
					imageRef.classificationStatus = "SUCCESS";
				}else{
					console.log("Form RecognizerError : Failed to get details")
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

		classifiedImageRef = await imageRef.save()
		return classifiedImageRef;
	}
}

/**
 * Returns a location 'operation-location' in the header 
 * @param {*} documentType 
 * @param {*} imageRef
 * @returns {Promise<any>}
 */
const postToFormRecognizer = async (documentType, imageRef) => {
	const MODELID = formRecognizerCodes[documentType]
	const SUBSCRIPTION_KEY = 'e6b14e091bc845149c7613b767f6d017'
	console.log(`MODELID ${MODELID}`);
	const URL = `https://dxsformrecognizer.cognitiveservices.azure.com/formrecognizer/v2.1-preview.1/custom/models/${MODELID}/analyze`;
	console.log("Creation of a form");
	const form = new FormData();
	form.append('name', 'image');

	var imageData = fs.readFileSync(imageRef.path);
	const headers = {
		'Content-type': 'image/jpeg',
		'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY
	}
	console.log(headers);	
	return axios.post(URL, imageData, { headers })
}

const getOperationFormRecognizer = async (operationLocation) => {
	const SUBSCRIPTION_KEY = 'e6b14e091bc845149c7613b767f6d017'
	const headers = {
		'Content-type': 'application/json',
		'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY
	}
	return axios.get(operationLocation, { headers })
		.then( response => {
			console.log("GET SUCCESS");
			return response.data;
		});
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