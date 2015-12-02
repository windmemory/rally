'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GroupSchema = new Schema({
  startDate: String,
  places: [{id: String,
          orderID: Number,
          latitude: Number,
          longtitude: Number,
          title: String,
          lengthOfStay: Number,
          estimatedPrice: Number,
          airport: String}],
  people: [{name: String, location: String, airport: String}],
  map: {center: {latitude: Number, longtitude:Number}, zoom: Number}
});

module.exports = mongoose.model('Group', GroupSchema);