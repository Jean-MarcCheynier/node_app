'use strict';

// Development specific configuration
// ==================================
module.exports = {

    // Server port
  port:     process.env.OPENSHIFT_NODEJS_PORT ||
            process.env.PORT ||
            8001,
  // MongoDB connection options - let password and username empty if no auth;
  mongo: {
    uri: process.env.MONGO_URI || "",
    username : process.env.MONGO_USERNAME || "",
    password : process.env.MONGO_PASSWORD || ""
  },
  seedDB: true
};