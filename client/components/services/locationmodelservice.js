'use strict';

angular.module('rallyangApp')
  .service('LocationModelService', function ($http) {
    /*
    var defaultLocations = [{
        id: '1marker',
        latitude: 47,
        longitude: -122,
        title: 'Seattle',
        lengthOfStay: 5,
        estimatedPrice: 100,
        locationDeals: [{
          title: 'One deal',
          price: 100
        }]
      }],
      defaultUsers = [{name: 'Lyle'}, {name: 'Radu'}],
      defaultGroupId = 1,
      groupTrips = {};
      
    groupTrips[defaultGroupId] = {
        groupId: '1',
        startDate: '12/1/2015',
        places: defaultLocations,
        people: defaultUsers,
        map: { center: { latitude: 47, longitude: -122 }, zoom: 8 }
    };
    */

    this.getGroupTrip = function(groupId, resultCallback) {
      $http.get('/api/group').success(function(groups) {
        if (groups && groups.length) {
          var result = groups[0];
          
          result.places = _.map(result.places, function(place) {
            if (place._id) {
              place.id = place._id;
            }
            place.longitude = place.longtitude;
            return place;
          });
          
          if (result.places && result.places.length) {
            result.map = { center: { latitude: result.places[0].latitude, longitude: result.places[0].longtitude }, zoom: 4 };            
          } else {
            result.map = { center: { latitude: 47.61, longitude: -122.20 }, zoom: 4 };
          }
          
          resultCallback(result);
        }
      });
    };
    
    this.addPlace = function(placeName, lengthOfStay) {
      console.log('adding ' + placeName);
      $http.post('/api/places', {title: placeName, lengthOfStay: lengthOfStay}).success(function() {
        console.log(placeName + ' added');
      });
    };
    
    this.removePlace = function(placeId) {
      $http.delete('/api/places/' + placeId).success(function() {
        console.log(placeId + ' removed');
      });      
    };
    
    /*
    var createRandomMarker = function (i, bounds, idKey) {
      var latMin = bounds.southwest.latitude,
        latRange = bounds.northeast.latitude - latMin,
        lngMin = bounds.southwest.longitude,
        lngRange = bounds.northeast.longitude - lngMin;
  
      if (!idKey) {
        idKey = 'id';
      }
  
      var latitude = latMin + (Math.random() * latRange);
      var longitude = lngMin + (Math.random() * lngRange);
      var ret = {
        latitude: latitude,
        longitude: longitude,
        title: 'm' + i
      };
      ret[idKey] = i;
      return ret;
    };
    */
    
    // uiGmapGoogleMapApi.then(function () {
    //     var markers = [];
    //     for (var i = 0; i < 10; i++) {
    //       markers.push(createRandomMarker(i, $scope.map.bounds));
    //     }
    //     $scope.randomMarkers = markers;      
    // });           
  });
