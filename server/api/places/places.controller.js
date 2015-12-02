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
var expApiKey = "VkCSTYX5FRtM7gxuWSjQYgLiTfG0yID0";

var geoRequestBuilder = function (city) {
	var result = "https://maps.googleapis.com/maps/api/geocode/json";
	result += "?address=" + city;
	result += "&key=" + ggApiKey;
	return encodeURI(result);
}

var airportRequestBuilder = function(city) {
	var result = "http://terminal2.expedia.com/x/suggestions/flights?query=";
	result += city;
	result += "&apikey=" + expApiKey;
	return encodeURI(result);
}

exports.index = function(req, res) {
  Group.find(function (err, group) {
    if(err) { return handleError(res, err); }
	return res.status(200).json(group[0].places);
  });
};

// add a new place in the DB.
exports.create = function(req, res) {
  if (req.body == null) return;
  Group.find(function(err, group) {
    if(err) { return handleError(res, err); }
    var place = req.body;
    var requesturl = geoRequestBuilder(place.title);
    request(requesturl, function(err, content, body) {
      var loc = JSON.parse(body).results[0].geometry.location;
      place.latitude = loc.lat;
      place.longtitude = loc.lng;
      place.estimatedPrice = 0;
      place.orderID = group[0].places.length;
      var portRequestStr = airportRequestBuilder(place.title);
      request(portRequestStr, function(err, content, body) {
        var airport = JSON.parse(body).sr[0].pt[0].t;
        place.airport = airport;
        group[0].places.push(place);
        group[0].save(function (err) {
          if (err) {return handleError(res, err); }
          return res.status(200).json(group);
        });
      });
    });
  });
};

// Updates an existing thing in the DB.
exports.update = function(req, res) {
  Group.find(function(err, group) {
    if(err) { return handleError(res, err); }
    var findID = req.params.id.toString();
    var i = 0;
    for (; i < group[0].places.length; i++) {
      if (group[0].places[i]._id.toString() === findID) break;
    }
    if (i === group[0].places.length) {
      return res.status(404).send("the place not found");
    }
    var place = req.body;
    if (place.title === group[0].places[i].title) {
      group[0].places[i].lengthOfStay = place.lengthOfStay;
      group[0].save(function (err) {
        if (err) {return handleError(res, err); }
        return res.status(200).json(group);
      })
    } else {
      var requesturl = geoRequestBuilder(place.title);
      request(requesturl, function(err, content, body) {
        var loc = JSON.parse(body).results[0].geometry.location;
        group[0].places[i].latitude = loc.lat;
        group[0].places[i].longtitude = loc.lng;
        group[0].places[i].estimatedPrice = 0;
        group[0].places[i].title = place.title;
        group[0].places[i].lengthOfStay = place.lengthOfStay;
        var portRequestStr = airportRequestBuilder(place.title);
        request(portRequestStr, function(err, content, body) {
          var airport = JSON.parse(body).sr[0].pt[0].t;
          group[0].places[i].airport = airport;
          group[0].save(function (err) {
            if (err) {return handleError(res, err); }
            return res.status(200).json(group);
          });
        });
      });
    }
  });
};

// Deletes a thing from the DB.
exports.destroy = function(req, res) {
  Group.find(function(err, group) {
    if(err) { return handleError(res, err); }
    var deleteID = req.params.id.toString();
    var i = 0;
    for (; i < group[0].places.length; i++) {
      if (group[0].places[i]._id.toString() === deleteID) break;
    }
    if (i === group[0].places.length) {
      return res.status(404).send("not found the place");
    }
    group[0].places.splice(i, i + 1);
    
    group[0].save(function (err) {
      if (err) {return handleError(res, err); }
      return res.status(200).json(group);
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}