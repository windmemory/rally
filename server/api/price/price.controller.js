/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /price              ->  index
 */

'use strict';

var Rx = require('rx');
var Group = require('../group/group.model');
var request = Rx.Observable.fromCallback(require('request'));
var expApiKey = "VkCSTYX5FRtM7gxuWSjQYgLiTfG0yID0";

var requestBuilder = function(req) {
  var result = "http://terminal2.expedia.com/x/flights/v3/search/1/";
	result += req.departure + '/';
  result += req.arrival + '/';
  result += req.date;
	result += "?apikey=" + expApiKey;
	return encodeURI(result);
}

exports.index = function(req, res) {
  Group.find(function (err, group) {
    if(err) { return handleError(res, err); }
    var depTime = new Date(group[0].startDate);
  	var airports = group[0].places.map(function(x) {return x.airport});
	  airports.unshift(req.params.home);
    airports.push(req.params.home);
    var flights = [];
    for (var i = 1; i < airports.length; i++) {
      var pair = {};
      pair.departure = airports[i - 1];
      pair.arrival = airports[i];
      pair.date = depTime.toISOString().slice(0,10);
      flights.push(pair);
      if (i != airports.length - 1) {
        depTime.setDate(depTime.getDate() + group[0].places[i - 1].lengthOfStay);
      }
    }
    
    var flightsStream = Rx.Observable.from(flights).map(function(x) {
      return Rx.Observable.return(x).delay(50);
    }).concatAll();
    
    var results = flightsStream.flatMap(function (flight) {
      var requestString = requestBuilder(flight);
      return request(requestString).map(function (response) {
        return JSON.parse(response[2]).recommended.trends[0].median;
      });
    });
    
    var prices = [];
    results.subscribe(
      function(x) {
        prices.push(x);
      },
      function(e) {console.log(e)},
      function() {
        var response = {};
        response.prices = prices;
        var total = 0.0;
        for (var i = 0; i < prices.length; i++) {
          total += parseFloat(prices[i])
        };
        response.totalPrice = total;
        return res.status(200).json(response);
      });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}