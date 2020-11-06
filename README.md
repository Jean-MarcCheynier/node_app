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
