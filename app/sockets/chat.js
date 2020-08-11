'use strict';
var MessageService = require('../services/messageService');

exports.register = function(nsp, socket, io){


  socket.on('message', function(data, ack){
  	console.log("RECIEVE MESSAGE");
    console.log("JOINED : "+this.id);
  	MessageService.save(data, function(data){
  		socket.broadcast.emit(
	  		'message', 
	  		data
	  	);
	    ack(data);
  	});
  });

}