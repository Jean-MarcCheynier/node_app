'use strict';


const Image = require('../models/image');
const ImageRef = require('../models/imageRef');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require("fs");
const request = require('request');
const axios = require('axios');
const {values} = require('../utils')

var url = require('url');
var https = require('https');
var HttpsProxyAgent = require('https-proxy-agent');

const AccidentStatement = require('../models/accidentStatement');

var CLASS = "StatementService : ";  

var StatementService = {

	attachImageRef: async (statement, imageRef) => {
		switch(imageRef.documentType) {
				case "ID_FR": 
				case "ID_BE":
					if(statement.driverA){
						console.log("DriverA present");
						statement.driverA.idCard.push(imageRef._id)
					}else{
						console.log("DriverA not present");
						statement.driverA = { idCard: [imageRef._id] }
					}

					break;
				default:
					console.error("Cannot attach imageRef to statement, Invalid documentType");
					throw({message: "Cannot attach document"}) 
					break;
		}

		const newStatement = await statement.save();
		//Populate it with the idCards
		await newStatement.populate('driverA.idCard').execPopulate()

		return newStatement;
		
	},


	findByOwnerId: function(ownerId){
		return AccidentStatement.find({owner: ownerId});
	},
	
	findById: function(id, callback){
		return AccidentStatement.findById(id);
	},

	save: function(data, callback){
		var accidentStatement = new AccidentStatement(data);
		return accidentStatement.save(data)
	},

	update: function(data, callback){
		delete data.local;
		AccidentStatement.findByIdAndUpdate(data._id,
			data, 
			{ 
				new: true,
				strict: true,
				overwrite: false,
			} , 
			(err, updatedData) => {
				if(err) { 
					throw err; 
				}
				callback(err, updatedData);
			}
		);
	},

	deleteById: function(id, callback){
		AccidentStatement.findByIdAndRemove(id, function (err,data){
    		if(err) { 
    			throw err; 
    		}
    		callback(err, data);
		})
	}
}

module.exports = StatementService;