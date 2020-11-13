# White app

## Requirement
* nodeJS 10.9 or later installed [NodeJS](https://nodejs.org/en/)
* mongodb 4.0 or later installed [MongoDB](https://www.mongodb.com/)

## Installation
* Run  `npm install` to install install all dependencies.
* Run  `npm start` to start the angular app on a local webserver.

## Configuration
Express requires the index config file ( app\config\environment\index.js ) and loads it at runtime with additional configs specific to the runtime environment. 
Specific configurations can be found in :
* app\config\environment\development.js
* app\config\environment\test.js (not used at the moment)
* app\config\environment\production.js


** HOW TO COMMUNICATE WITH OCR

  French ID df59ec7e-b341-4fc7-9d12-d3911a958619 29/09 - 17:00
  Belgian ID 7c8b063b-423c-49a0-8de9-5e8207989a64 28/09 - 12:00
  GreenCard sticker 4a271819-31d4-434b-8e96-98636ecace67 29/09 - 12:00
  GreenCard 55ae359d-569c-47eb-a72c-63fe5489e098 29/09 - 15:00
  European driving license aa49cd75-acd4-482e-aba6-69f6b942a17a 25/09 - 12:00

- Post image top server
  POST : https://dxsformrecognizer.cognitiveservices.azure.com/formrecognizer/v2.1 -
preview.1/custom/models/{MODELID}/analyze 


- Get description
  Return: Operaration-Location : <ULR>
  GET : URL
  Return description