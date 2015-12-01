'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GroupSchema = new Schema({
  startDate: String,
  places: [{id: String,
          latitude: Number,
          longtitude: Number,
          title: String,
          lengthOfStay: Number,
          estimatedPrice: Number}],
  people: [{name: String}],
  map: {center: {latitude: Number, longtitude:Number}, zoom: Number}
});

module.exports = mongoose.model('Group', GroupSchema);