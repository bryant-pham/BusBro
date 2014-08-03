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

	$scope.goToNextLocation = function(location) {
		$scope.currentLocation = location;
	};

	$scope.strikeThroughOldTimes = function(timeString) {
		var currentDate = new Date();
		var currentHours = currentDate.getHours();
  		var currentMinutes = currentDate.getMinutes();

  		var hours = timeString.substr(0, timeString.indexOf(':'));
  		var minutes = timeString.substr(timeString.indexOf(':')+1);
  		var amOrPm = timeString.substr(timeString.length - 2);

  		var hoursInt = parseInt(hours);
  		var minutesInt = parseInt(minutes);

  		if(amOrPm === 'PM' && hoursInt < 12) {
  			hoursInt += 12;
  		}

  		if(currentHours > hoursInt) {
  			return true;
  		}
		if(currentMinutes > minutesInt && currentHours === hoursInt) {
			return true;
		}

		return false;
	};

	var initRoute = function(data) {
		return Object.keys(data)[0];
	};

	var initLocation = function(route) {
		return $scope.data[route][0].name;
	};

	$scope.init();
});

