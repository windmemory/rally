'use strict';

var _ = require('lodash');
var Group = require('../group/group.model');
var request = require('request');
var expApiKey = "VkCSTYX5FRtM7gxuWSjQYgLiTfG0yID0";

var airportRequestBuilder = function(city) {
	var result = "http://terminal2.expedia.com/x/suggestions/flights?query=";
	result += city;
	result += "&apikey=" + expApiKey;
	return encodeURI(result);
}

exports.create = function(req, res) {
  if (req.body == null) return;
  Group.find(function(err, group) {
    if(err) { return handleError(res, err); }
    var people = req.body;
    
    var portRequestStr = airportRequestBuilder(people.location);
    request(portRequestStr, function(err, content, body) {
      var airport = JSON.parse(body).sr[0].pt[0].t;
      people.airport = airport;
      group[0].people.push(people);
      group[0].save(function (err) {
        if (err) {return handleError(res, err); }
        return res.status(200).json(group);
      });
    });
  });
};

exports.update = function(req, res) {
  Group.find(function(err, group) {
    if(err) { return handleError(res, err); }
    var findID = req.params.id.toString();
    var i = 0;
    for (; i < group[0].people.length; i++) {
      if (group[0].people[i]._id.toString() === findID) break;
    }
    if (i === group[0].people.length) {
      return res.status(404).send("the place not found");
    }
    var people = req.body;
    if (people.location === group[0].people[i].location) {
      group[0].people[i].name = people.name;
      group[0].save(function (err) {
        if (err) {return handleError(res, err); }
        return res.status(200).json(group);
      })
    } else {
      var portRequestStr = airportRequestBuilder(people.location);
      request(portRequestStr, function(err, content, body) {
        var airport = JSON.parse(body).sr[0].pt[0].t;
        group[0].people[i].airport = airport;
        group[0].save(function (err) {
          if (err) {return handleError(res, err); }
          return res.status(200).json(group);
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
    for (; i < group[0].people.length; i++) {
      if (group[0].people[i]._id.toString() === deleteID) break;
    }
    if (i === group[0].people.length) {
      return res.status(404).send("not found the place");
    }
    group[0].people.splice(i, i + 1);
    
    group[0].save(function (err) {
      if (err) {return handleError(res, err); }
      return res.status(200).json(group);
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}