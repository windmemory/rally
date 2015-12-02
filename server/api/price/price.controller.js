/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /price              ->  index
 */

'use strict';

var Group = require('../group/group.model');
var request = require('request');
var expApiKey = "VkCSTYX5FRtM7gxuWSjQYgLiTfG0yID0";



exports.index = function(req, res) {
  Group.find(function (err, group) {
    if(err) { return handleError(res, err); }
	var places = group[0].places.map(function(x) {return x.title});
	var airports = places.map(function(x) {
		var requestStr = airportRequestBuilder(x);
		request(requestStr, function(err, content, body) {
			
			return body;
		})
	})
	console.log(airports);
	return res.status(200).json(group[0].places);
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}