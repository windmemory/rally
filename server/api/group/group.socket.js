/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var group = require('./group.model');

exports.register = function(socket) {
  group.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  group.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  console.log('emmit group:save event');
  socket.emit('group:save', doc);
}

function onRemove(socket, doc, cb) {
  console.log('emmit group:remove event');
  socket.emit('group:remove', doc);
}