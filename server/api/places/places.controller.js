/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /places              ->  index
 * POST    /places              ->  create
 * GET     /places/:id          ->  show
 * PUT     /places/:id          ->  update
 * DELETE  /places/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Group = require('../group/group.model');
var request = require('request');
var ggApiKey = "AIzaSyAHV1wqS2So1_wOxGcXf1D9fzeaIapQ_Is";
// Get list of things

var geoRequestBuilder = function (city) {
	var result = "https://maps.googleapis.com/maps/api/geocode/json";
	result += "?address=" + city;
	result += "&key=" + ggApiKey;
	return encodeURI(result);
}

exports.index = function(req, res) {
  Group.find(function (err, group) {
    if(err) { return handleError(res, err); }
	return res.status(200).json(group[0].places);
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
  
  Group.find(function(err, group) {
    if(err) { return handleError(res, err); }
    var place = req.body;
    var requesturl = geoRequestBuilder(place.title);
    request(requesturl, function(err, content, body) {
      var loc = JSON.parse(body).results[0].geometry.location;
      place.latitude = loc.lat;
      place.longtitude = loc.lng;
      place.estimatedPrice = 0;
      group[0].places.push(place);
      console.log(group);
      group[0].save(function (err) {
        if (err) {return handleError(res, err); }
        return res.status(200).json(group);
      });
    });
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