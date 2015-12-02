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
        console.log('groupsResponse: ' + groups);
        var groupsResponse = JSON.parse(groups);
        if (groupsResponse && groupsResponse.length) {
          resultCallback(groupsResponse[0]);
        }
      });
    };
    
    this.addPlace = function(placeName, lengthOfStay) {
      console.log('adding ' + placeName);
      $http.post('/api/places', {title: placeName, lengthOfStay: 1}).success(function() {
        console.log(placeName + ' added');        
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
