var busBroApp = angular.module('busBroApp', []);
busBroApp.controller('purpleCtrl', function($scope, $http) {
	$scope.init = function() {
		$http.get('scripts/schedule.json').success(function(data) {
			$scope.data = data;
		});
	}
	

	$scope.nextRoute = function() {
		if($scope.routePos == ($scope.keys.length-1))
			$scope.routePos = 0;
		else
			$scope.routePos++;
		$scope.route = $scope.keys[$scope.routePos];
	}

	$scope.lastRoute = function() {
		if($scope.routePos == 0)
			$scope.routePos = ($scope.keys.length-1);
		else
			$scope.routePos--;
		$scope.route = $scope.keys[$scope.routePos];
	}
	$scope.init();
});

