'use strict';

var express = require('express');
var router = express.Router();
const multer  = require('multer');
var upload = multer({ dest: 'public/tmp' });
const ImageService = require('../../services/ImageService');


module.exports = function(){
    router.route('/')
    .post(upload.single('imageUpload'), function (req, res) {
        console.log(req.headers);
        if(req.file){
            ImageService.saveImgFlie(req.file,
                function(err, data){
                    res.json(data)
                }
            );
        }
        if(req.data){
            ImageService.saveImgData(req.data,
                function(err, data){
                    res.json(data)
                }
            );
        }

    });

    router.route('/:imageId')
    .get(function (req, res){
        console.log("COUCOU");
        console.log(req.params.imageId);
        ImageService.findById(req.params.imageId,
			function(err, image){
                if(err){

                }else{
                    var image64 = Buffer.from(image.data, 'base64');
                    res.writeHead(200, {
                        'Content-Type': 'image/png',
                        'Content-Transfer-Encoding': 'base64',
                        'Content-Length': image64.length
                      });
                      res.end(image64);  
                }
			}
		); 
    })
    return router  
}