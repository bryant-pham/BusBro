'use strict';

var busBroApp = angular.module('busBroApp', []);
busBroApp.controller('busBroCtrl', function($scope, $http) {

	$scope.currentRoute = null;
	$scope.currentLocation = null;

	$scope.init = function() {
		$http.get('scripts/schedule.json').success(function(data) {
			$scope.data = data;

			$scope.currentRoute = initRoute($scope.data);
			$scope.currentLocation = initLocation($scope.currentRoute);
		});
	};

	$scope.refreshLocationOnRouteChange = function() {
		$scope.currentLocation = initLocation($scope.currentRoute);
	};

	var initRoute = function(data) {
		return Object.keys(data)[0];
	};

	var initLocation = function(route) {
		return $scope.data[route][0].name;
	};

	$scope.init();
});

