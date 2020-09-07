
const Image = require('../models/image');
const ImageRef = require('../models/imageRef');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require("fs");
const request = require('request');
const axios = require('axios');

var url = require('url');
var https = require('https');
var HttpsProxyAgent = require('https-proxy-agent');


const CLASS = "imageService : ";

const classify = imageRef => {
	const URL = "http://cardamageapi.westeurope.azurecontainer.io:5000/classify";
	const form = new FormData();
	form.append('name', ' image');
	const file = fs.createReadStream(imageRef.path);
	form.append('file', file);

	return axios.post(URL, form, { headers: {...form.getHeaders()}  });
}


const saveImgFile = function(imageRef, callback){
	var imageData = fs.readFileSync(imageRef.path);
	var contentType = imageRef.mimetype;

	// Create an Image instance
	const imageToSave = new Image({
		type: contentType,
		data: imageData
	});
	imageToSave.save( function(err, data){
		try {
			fs.unlinkSync(imageRef.path)

		} catch(unlinkError) {
			console.error(unlinkError)
		}
		if(err){
			return console.error(err);
		}
		callback(err, data);
	});
};


const saveImgRef = function(user, imageRef, callback){
	ImageRef.create({
		owner: user._id,
		img: imageRef._id,  
		mimetype: imageRef.mimetype,
		type: imageRef.type,
		name: imageRef.name,
		classification: imageRef.classification
	},
	(err, newIMageRef) => {
		if(err){
			return console.error(err);
		}
		callback(err, newIMageRef);

	})
};

const save = function(user, imageRef, callback){
	classify(imageRef).then(classifyResponse => {
		console.log("Classify success");
		imageRef.classification = classifyResponse.data.classification;
		console.log(imageRef);
		saveImgFile(imageRef, (imgSaveErr, newImage) => {
			if(imgSaveErr){
				console.log("Error could not save image");
				return callback(err);
			}else{
				console.log("Img saved successfuly");
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
	save,
	findById,
	findAll,
	findByOwnerId,
	classify
}

module.exports = ImageService;