/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');


module.exports = function (io) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  console.log("CONFIG SOCKET : ")

  io.sockets.on('connection', function (socket) {
    console.info('CONNECTED');
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();


    var res = {};
    res[socket.id] = player;
    socket.broadcast.emit('connection', res);
    socket.emit('connection', "connected" );

    socket.on('disconnect', function () {
      console.info('[%s] DISCONNECTED', socket.address);
      io.sockets.emit('disconnect', socket.id)
    });
    console.info('[%s] CONNECTED', socket.address);
  });


/*  Multiplexing single connexion : */

  /* Chat namespace */
  var chat = io.of('/chat');
  chat.on('connection', function (socket) {
    console.info('[%s] CONNECTED TO CHAT', socket.address);
    require('../sockets/chat.js').register(this, socket, io);
  });

};