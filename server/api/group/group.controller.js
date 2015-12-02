/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /group/id            ->  index
 * POST    /group/id            ->  create
 * PUT     /group/id            ->  update
 */

'use strict';

var _ = require('lodash');
var Group = require('./group.model');

// Get list of things
exports.index = function(req, res) {
  Group.find(function (err, group) {
    if(err) { return handleError(res, err); }
    if(!group) { return res.status(404).send('Not Found'); }
    return res.json(group);
  });
};

exports.create = function(req, res) {
  console.log('creating object: ' + JSON.stringify(req.body));
  Group.create(req.body, function(err, group) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(group);
  });
};

exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Group.findById(req.params.id, function (err, group) {
    if (err) { return handleError(res, err); }
    if(!group) { return res.status(404).send('Not Found'); }
    var updated = _.merge(group, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(group);
    });
  });
};

exports.changeDate = function(req, res) {
  Group.find(function(err, group) {
    if (err) { return handleError(res, err); }
    group[0].startDate = req.params.date;
    group[0].save(function(err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(group);
    });
  });
}

function handleError(res, err) {
  return res.status(500).send(err);
}