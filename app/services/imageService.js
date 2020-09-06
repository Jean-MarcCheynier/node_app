
const Image = require('../models/image');
const ImageRef = require('../models/imageRef');
const fs = require("fs")


const CLASS = "imageService : ";  

var ImageService = {
	saveImgFlie: function(imageRef, callback){
        var imageData = fs.readFileSync(imageRef.path);
        var contentType = imageRef.mimetype;
    
        // Create an Image instance
        const imageToSave = new Image({
            type: contentType,
            data: imageData
        });
		imageToSave.save( function(err, data){
			if(err){
				return console.error(err);
			}
			callback(err, data);
		});
	},
	saveImgData: function(imageData, callback){
    
        // Create an Image instance
        const imageToSave = new Image({
            type: 'image/jpeg',
            data: imageData
        });
        console.log(imageToSave);
		imageToSave.save( function(err, data){
			if(err){
				return console.error(err);
			}
			callback(err, data);
		});
    },
    
    findById: function(imageId, callback){
		Image.findById(imageId, function(err, data){
			if(err){
				return console.error(err);
			}
			callback(err, data);
		});
	},

}

module.exports = ImageService;