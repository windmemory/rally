/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /places/:Gid         ->  index
 * POST    /places              ->  create
 * GET     /places/:id          ->  show
 * PUT     /places/:id          ->  update
 * DELETE  /places/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Group = require('../group/group.model');

// Get list of things
exports.index = function(req, res) {
  Group.findById(req.params.Gid, function (err, group) {
    if(err) { return handleError(res, err); }
    JSON.parse(group);
	return res.status(200).json(group);
  });
};

// Get a single thing
exports.show = function(req, res) {
  Group.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.status(404).send('Not Found'); }
    return res.json(thing);
  });
};

// Creates a new thing in the DB.
exports.create = function(req, res) {
  Group.create(req.body, function(err, thing) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(thing);
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Group.findById(req.params.id, function (err, thing) {
    if (err) { return handleError(res, err); }
    if(!thing) { return res.status(404).send('Not Found'); }
    var updated = _.merge(thing, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(thing);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Group.findById(req.params.id, function (err, thing) {
    if(err) { return handleError(res, err); }
    if(!thing) { return res.status(404).send('Not Found'); }
    thing.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}