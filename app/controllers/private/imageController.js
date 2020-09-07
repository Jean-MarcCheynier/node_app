'use strict';

var express = require('express');
var router = express.Router();
const multer  = require('multer');
const ImageService = require('../../services/ImageService');
const {allow} = require('../middleware/passportMiddleware');

//TO PUT IN ENV FILE
const URL = "cardamageapi.westeurope.azurecontainer.io:5000/classify";

//STORAGE CONFIG TO EXTERNALIZE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/tmp')
    },
    filename: function (req, file, cb) {
    console.log(file);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix+".png")
    }
})
  
var upload = multer({ storage: storage })



module.exports = function(){
    router.route('/')
    .post(upload.single('file'), function (req, res) {
        if(req.file){
            ImageService.save(req.user, req.file,
                function(err, data){
                    console.log("Returning");
                    console.log(data);
                    if(err){
                        res.status(500).json({errmsg: "ERR"});
                    }else{
                        res.json(data)
                    }
                }
            );
        }
    })
    .get(allow('me', 'admin', 'insurer'), (req, res) => {
        switch(req.user.role){
            case "user": ImageService.findByOwnerId(req.user._id, (err, data) => {
                if(err){
                    
                }else{
                    res.json(data);
                }
            });
            break;
            case "insurer": ImageService.findAll((err, data) => {
                if(err){
                    res.json(data);
                }else{
                    
                }
            });
            break;
            default: return res.status(401).json({errmsg: "ERR"})
        }
    })

    router.route('/:imageId')
    .get(function (req, res){
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