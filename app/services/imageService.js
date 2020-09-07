
const Image = require('../models/image');
const ImageRef = require('../models/imageRef');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require("fs");
const request = require('request');

var url = require('url');
var https = require('https');
var HttpsProxyAgent = require('https-proxy-agent');


const CLASS = "imageService : ";

const classify = (imageRef, callback) => {
	const URL = "https://cardamageapi.westeurope.azurecontainer.io:5000/classify";
	const data = new FormData();
	data.append('name', imageRef.path);
	data.append('file', fs.createReadStream(imageRef.path));
	console.log("File created");
	console.log(data);

	request.post({url:URL, data}, function optionalCallback(err, httpResponse, body) {
		if (err) {
			return console.error('upload failed:', err);
		}
		console.log('Upload successful!  Server responded with:', body);
		});



/* 	// HTTP/HTTPS proxy to connect to
	var proxy = process.env.http_proxy || 'http://168.63.76.32:3128';
	console.log('using proxy server %j', proxy);
	try{
		fetch('https://cardamageapi.westeurope.azurecontainer.io:5000/classify', { 
			method: 'POST', 
			body: data,
			headers: {'Content-Type': 'multipart/form-data'}
		})
		.then(classifyResponse => {
			if(classifyResponse.ok){
				imageRef.classification = classifyResponse.data;
			}else{
				throw MyCustomError(res.statusText);
			}
		}) // expecting a json response
		.then(json => console.log(json));	 */

		
/* 	} catch (err) {
		console.log("CLASSIFY_ERROR");
		console.log(err);
	} */
	callback(null, imageRef);
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
		name: imageRef.name
	},
	(err, newIMageRef) => {
		if(err){
			return console.error(err);
		}
		callback(err, newIMageRef);

	})
};

const save = function(user, imageRef, callback){
	classify(imageRef, (classificationError, withClassification) => {
		saveImgFile(withClassification, (err, newImage) => {
			if(err){
				return callback(err);
			}else{
	
				withClassification._id = newImage._id
				saveImgRef(user, withClassification, callback);
			}
		})

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