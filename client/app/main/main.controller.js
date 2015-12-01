'use strict';

angular.module('rallyangApp')
  .controller('MainCtrl', function ($scope, $http, socket, uiGmapGoogleMapApi, LocationModelService) {
    $scope.newPlaceName = '';
    $scope.newPlaceLengthOfStay = 1;
    $scope.groupId = 1;
    
    var groupCallback = function(group) {
      if (group !== null) {
          $scope.map = group.map;
          $scope.map.markers = group.places;
        }      
    };
    
    LocationModelService.getGroupTrip($scope.groupId, groupCallback);
    socket.syncUpdates('places', [], function(event, item) {
      console.log('reloading information for group ' + $scope.groupId);
      LocationModelService.getGroupTrip($scope.groupId, groupCallback);
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
      if ($scope.newPlaceName === '' || $scope.newPlaceLengthOfStay < 1) {
        return;
      }
      LocationModelService.addPlace($scope.newPlaceName, $scope.newPlaceLengthOfStay);
      $scope.newPlaceName = '';
      $scope.newPlaceLengthOfStay = 1;
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
