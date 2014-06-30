var busBroApp = angular.module('busBroApp', []);
busBroApp.controller('purpleCtrl', function($scope, $http) {
	$scope.route = null;
	$scope.keys = [];
	$scope.routePos = 0;
	$http.get('scripts/schedule.json').success(function(data) {
		$scope.purpleMcgovern = data.purple.mcgovern;
		$scope.purpleBcmMain = data.purple.bcmMain;
		$scope.purpleJamail = data.purple.jamail;
		$scope.purpleBcmMedCenter = data.purple.bcmMedCenter;

		angular.forEach(data, function(routes, color){
			angular.forEach(routes, function(value, routeKey) {
				$scope.keys.push(routeKey);
			});
		});
		$scope.route = $scope.keys[$scope.routePos];
	});

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

});

