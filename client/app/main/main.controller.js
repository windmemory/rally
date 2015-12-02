'use strict';

angular.module('rallyangApp')
  .controller('MainCtrl', function ($scope, $http, socket, uiGmapGoogleMapApi, LocationModelService) {
    $scope.newPlaceName = '';
    $scope.newPlaceLengthOfStay = 1;
    $scope.groupId = 1;
    $scope.lastUpdated = 0;
    
    var groupCallback = function(group) {
      if (group !== null) {
          $scope.map = group.map;
          $scope.map.markers = group.places;
        }      
    };
    
    LocationModelService.getGroupTrip($scope.groupId, groupCallback);
    socket.syncUpdates('group', [], function(event, item) {
      console.log('reloading information for group ' + $scope.groupId + ' on event ' + event + ' for item ' + item);
      var currentTime = new Date().getTime();
      
      if (currentTime - $scope.lastUpdated > 1000) {
        console.log('query api for updates...');
        LocationModelService.getGroupTrip($scope.groupId, groupCallback);
        $scope.lastUpdated = currentTime;
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
