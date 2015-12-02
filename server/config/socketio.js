/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment'),
    _ = require('lodash'),
    chatUsers = [];

// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socketio, socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', function (data) {
    console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });

  // Insert sockets below
  require('../api/thing/thing.socket').register(socket);
  require('../api/group/group.socket').register(socket);
  require('../auth/auth.service').register(socket);
  
    // chat
    socket.on('user:login', function (user) {
      console.log('current users: ' + JSON.stringify(chatUsers));
      if (!_.some(chatUsers, function(existingUser) {return existingUser.name === user.name })) {
        console.log('recieved join request from', user.name);
        console.log('broadcasting message');
        chatUsers.push(user);
      } else {
        console.log('user already registered: ' + JSON.stringify(user));
      }
      socketio.emit('user:update', {
        users: chatUsers
      });
    });  
}

module.exports = function (socketio) {
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

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
      console.info('[%s] DISCONNECTED', socket.address);
    });
          
    // Call onConnect.
    onConnect(socketio, socket);
    console.info('[%s] CONNECTED', socket.address);
  });
};