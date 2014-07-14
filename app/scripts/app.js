'use strict';

var busBroApp = angular.module('busBroApp', []);
busBroApp.controller('busBroCtrl', function($scope, $http) {

	$scope.init = function() {
		$http.get('scripts/schedule.json').success(function(data) {
			$scope.routes = [];
			$scope.locations = [];
			$scope.data = data;
			setRoutesAndLocationsArray($scope.data);

			$scope.currentLocation = $scope.locations[0];
			$scope.currentRoute = $scope.routes[0];
		});
	};

	$scope.getLocationFromArray = function(index) {
		return $scope.locations[index];
	};

	$scope.getRouteFromArray = function(index) {
		return $scope.routes[index];
	};

	var setRoutesAndLocationsArray = function(data) {
		angular.forEach(data, function(routeValues, route) {
			$scope.routes.push(route);
			angular.forEach(routeValues, function(locationValues, location) {
				$scope.locations.push(location);
			});
		});
	};

	$scope.init();
});

