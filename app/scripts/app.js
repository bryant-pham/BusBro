'use strict';

var busBroApp = angular.module('busBroApp', []);
busBroApp.controller('busBroCtrl', function($scope, $http) {
	$scope.currentRoute        = null;
	$scope.currentLocation     = null;
	$scope.transferRoute       = null;
	$scope.transferLocation    = null;
	$scope.destinationLocation = null;
	$scope.displayedLocationName = null;
	$scope.model = null;
	$scope.borderColor = null;
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
			$scope.displayedLocationName = $scope.locations[0];
			
			if(isRedTime()) {
				$scope.model = $scope.data.Red[$scope.locations[0]];
				$scope.currentRoute = 'Red';
				$scope.transferRoute = 'Red';
			} else {
				$scope.model = $scope.data.Purple[$scope.locations[0]];
				$scope.currentRoute = 'Purple';
				$scope.transferRoute = 'Purple';
			}
			$scope.borderColor = $scope.currentRoute;
		});
	};

	var isRedTime = function() {
		var currentTime = new Date();
		var currentHour = currentTime.getHours();
		var currentMinute =  currentTime.getMinutes();

		//Force red route if between 12:00AM - 8:20AM and after 4:41PM
		if((currentHour >= 0 && (currentHour <= 8 && currentMinute <= 20)) || (currentHour >= 16 && currentMinute >= 41)) {
			return true;
		}
		return false;
	};

	$scope.refreshRoutesAndTimelist = function() {
		refreshRoutes();
		refreshModel();
		refreshDisplayedLocationName();
	};

	var refreshRoutes = function() {
		//Determine if locations are on the same route
		if(isRedTime()) {
			$scope.transferRoute = 'Red';
			$scope.currentRoute  = 'Red';
		} else {
			if($scope.data.Purple[$scope.currentLocation] && $scope.data.Purple[$scope.destinationLocation]) {
				$scope.transferRoute = 'Purple';
				$scope.currentRoute  = 'Purple';
				$scope.borderColor = $scope.currentRoute;
				return; 
			} else if($scope.data.Blue[$scope.currentLocation] && $scope.data.Blue[$scope.destinationLocation]) {
				$scope.transferRoute = 'Blue';
				$scope.currentRoute  = 'Blue';
				$scope.borderColor = $scope.currentRoute;
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
				$scope.transferLocation = $scope.data[$scope.transferRoute][$scope.destinationLocation].bestTransferLocation;
			}
		}
		$scope.borderColor = $scope.currentRoute;
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

	$scope.displayLocationTimes = function(location) {
		if(!($scope.data[$scope.currentRoute][location])) {
			$scope.model = $scope.data[$scope.transferRoute][location];
			$scope.borderColor = $scope.transferRoute;
		} else {
			$scope.model = $scope.data[$scope.currentRoute][location];
			$scope.borderColor = $scope.currentRoute;

		}		
		$scope.displayedLocationName = location;
	};

	$scope.displayTransferLocationTimes = function(location) {
		$scope.model = $scope.data[$scope.transferRoute][location];
		$scope.displayedLocationName = location;
		$scope.borderColor = $scope.transferRoute;
	};

	$scope.init();
});

