'use strict';

var _ = require('lodash');
var Group = require('../group/group.model');
var request = require('request');

exports.swap = function(req, res) {
  Group.find(function(err, group) {
    if (err) { return handleError(res, err); }
    var first = parseInt(req.params.index);
    if (first > group[0].places.length - 2 || first < 0) return res.status(500).send('index ouside the range');
    for (var i = 0; i < group[0].places.length; i++) {
      if (parseInt(group[0].places[i].orderID) === first) group[0].places[i].orderID++;
      else if (parseInt(group[0].places[i].orderID) === first + 1) group[0].places[i].orderID--;
    }
    group[0].save(function(err) {
      if (err) {return handleError(res, err); }
      return res.status(200).json(group[0]);
    })
  })
}

function handleError(res, err) {
  return res.status(500).send(err);
}