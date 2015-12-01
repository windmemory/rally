'use strict';

angular.module('rallyangApp')
  .controller('MainCtrl', function ($scope, $http, socket, uiGmapGoogleMapApi, LocationModelService) {
    newPlaceName = '';
    
    LocationModelService.getGroupTrip(1, function(group) {
      if (group != null) {
        $scope.map = group.map;
        $scope.map.markers = group.places;
      }
    });
        
    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.onMarkerClicked = function (marker) {
      marker.showWindow = false;
      console.log('updating map onclick');
      $scope.$apply();
      //window.alert("Marker: lat: " + marker.latitude + ", lon: " + marker.longitude + " clicked!!")
    };
    
    $scope.addPlace = function() {
      if($scope.newPlaceName === '') {
        return;
      }
      LocationModelService.addPlace($scope.newPlaceName);
      $scope.newPlaceName = '';
    };    
  
    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
