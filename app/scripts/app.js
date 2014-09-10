'use strict';

var busBroApp = angular.module('busBroApp', []);
busBroApp.controller('busBroCtrl', function($scope, $http) {
	$scope.currentRoute        = null;
	$scope.transferRoute       = null;
	$scope.currentLocation     = null;
	$scope.destinationLocation = null;
	$scope.displayedLocationName = null;
	$scope.model = null;
	$scope.locations = [
		'McGovern', 
		'BCM Main', 
		'Jamail', 
		'BCM Medical Center', 
		'Baylor Clinic', 
		'VA Medical Center'
	];

	$scope.init = function() {
		$http.get('scripts/schedule.json').success(function(data) {
			//Init scope variables
			$scope.data = data;
			$scope.model = $scope.data.Purple[$scope.locations[0]];
			$scope.displayedLocationName = $scope.locations[0];
			$scope.currentRoute = initRoute($scope.data);
			$scope.transferRoute = initRoute($scope.data);
		});
	};

	$scope.refreshRoutesAndTimelist = function() {
		refreshRoutes();
		refreshModel();
		refreshDisplayedLocationName();
	};

	var refreshRoutes = function() {
		//Determin if locations are on the same route
		if($scope.data.Purple[$scope.currentLocation] && $scope.data.Purple[$scope.destinationLocation]) {
			$scope.transferRoute = 'Purple';
			$scope.currentRoute  = 'Purple';
			return; 
		} else if($scope.data.Blue[$scope.currentLocation] && $scope.data.Blue[$scope.destinationLocation]) {
			$scope.transferRoute = 'Blue';
			$scope.currentRoute  = 'Blue';
			return; 
		}

		//Determine if locations are cross-route
		if(!($scope.data[$scope.currentRoute][$scope.currentLocation])) {
			if($scope.currentRoute === 'Purple') {
				$scope.currentRoute = 'Blue';
			} else {
				$scope.currentRoute = 'Purple';
			}
		}

		if(!($scope.data[$scope.currentRoute][$scope.destinationLocation])) {
			if($scope.currentRoute === 'Purple') {
				$scope.transferRoute = 'Blue';
			} else {
				$scope.transferRoute = 'Purple';
			}
		}
	};

	var refreshModel = function() {
		$scope.model = $scope.data[$scope.currentRoute][$scope.currentLocation];
	};

	var refreshDisplayedLocationName = function() {
		$scope.displayedLocationName = $scope.currentLocation;
	};

	$scope.hasTimePassed = function(timeString) {
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

	$scope.changeLocation = function(location) {
		if(!($scope.data[$scope.currentRoute][location])) {
			$scope.model = $scope.data[$scope.transferRoute][location];
		} else {
			$scope.model = $scope.data[$scope.currentRoute][location];
		}		
		$scope.displayedLocationName = location;
	};

	$scope.init();
});

