(function(){
	'use strict';
	/**
	* app Module
	*
	* Description
	*/
	angular.module('app', []).controller('derpController',
		['$scope', '$http', 'service', function($scope, $http, service){
			$scope.serviceCall = function(){
				$scope.serviceCallResult = service.call();
			};

			$scope.result = $http.get('/someUrl');
		}]).service('service', ['', function(){
			this.call = function () {
				return 'This should not been returned';				
			};
		}]);
})();