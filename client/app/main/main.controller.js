'use strict';

angular.module('rallyangApp')
  .controller('MainCtrl', function ($scope, $http, socket, uiGmapGoogleMapApi, LocationModelService, Auth) {
    $scope.newPlaceName = '';
    $scope.newPlaceLengthOfStay = 1;
    $scope.groupId = 1;
    $scope.lastUpdated = 0;
    $scope.chatUsers = [];
    $scope.totalPrice = 0;
    $scope.currentPerson = {};
    $scope.currentStartDate = '2015-12-2';
    
    var groupCallback = function(group) {
      if (group !== null) {
          console.log('updating for group ' + JSON.stringify(group));
          $scope.map = group.map;
          $scope.map.markers = group.places;
          $scope.currentStartDate = group.startDate;
          var currentLoggedInUser = Auth.getCurrentUser();
          
          console.log('scope updated to ' + JSON.stringify($scope.map));
          
          var currentUser = _.first(_.filter(group.people, function(people) {
            console.log(people.name + ' vs ' + currentLoggedInUser.name);
            return people.name === currentLoggedInUser.name;
          }));
          
          $scope.currentPerson = currentUser;          
          updatePricesForUserLocation();
        }
    };
    
    function updatePricesForUserLocation() {
          if ($scope.currentPerson) {
            console.log('current user for location: ' + JSON.stringify($scope.currentPerson));
            LocationModelService.updatePlaceWithPrices($scope.currentPerson.airport, function(priceInfo) {
              $scope.totalPrice = parseFloat(priceInfo.totalPrice).toFixed(2);
              for (var i = 0; i < $scope.map.markers.length; i++) {
                $scope.map.markers[i].price = priceInfo.prices[i];
              }
            });
          }     
    }
        
    // LocationModelService.getGroupTrip($scope.groupId, groupCallback);
    // socket.syncUpdates('group', [], function(event, item) {
    //   console.log('reloading information for group ' + $scope.groupId + ' on event ' + event + ' for item ' + item);
    //   var currentTime = new Date().getTime();
      
    //   if (currentTime - $scope.lastUpdated > 1000) {
    //     console.log('query api for updates...');
    //     LocationModelService.getGroupTrip($scope.groupId, groupCallback);
    //     $scope.lastUpdated = currentTime;
    //   }
    // });
    
    socket.syncUsers(function(users) {
      console.log('chat users: ' + JSON.stringify(users));
      $scope.chatUsers = users.users;
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
    
    $scope.removePlace = function(placeId) {
      console.log('removing place with id ' + placeId);
      LocationModelService.removePlace(placeId);
    };
    
    $scope.updatePlace = function(placeId) {
      console.log('updating place: ' + placeId);
      var placeToUpdate = _.first(_.filter($scope.map.markers, function(m) {
        return m._id === placeId;
      }));
      LocationModelService.updatePlace(placeToUpdate);
      updatePricesForUserLocation();
    };
    
    function movePlace(moveUp, placeId) {
      var place = _.first(_.filter($scope.map.markers, function(m) {
        return m._id === placeId;
      }));
      
      if (!place) {
        console.log('can not find place with id ' + placeId);
        return;
      }
      
      LocationModelService.movePlace(place.orderID, function() {
        LocationModelService.getGroupTrip($scope.groupId, groupCallback);
      });
    }
    
    $scope.movePlaceDown = function(placeId) {
      movePlace(false, placeId);
    };
    
    $scope.movePlaceUp = function(placeId) {
      movePlace(true, placeId);
    };
    
    $scope.updateStartDate = function() {
      console.log('updating start date...' + $scope.currentStartDate);
      LocationModelService.updateStartDate($scope.currentStartDate, function() {
        LocationModelService.getGroupTrip($scope.groupId, groupCallback);
      });
    };
        
    Auth.isLoggedInAsync(function(isloggedIn) {
      if (isloggedIn) {
        var loggedInUser = Auth.getCurrentUser();
        console.log('user logged in, add him to chat: ' + JSON.stringify(loggedInUser));
        
        socket.socket.emit('user:login', {name: loggedInUser.name});
        
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
      }
    });        
  
  /*
    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });
      
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
*/

    $scope.$on('$destroy', function () {
      console.log('context destroy for the main page');
      socket.unsyncUpdates('group');
    });
  });
