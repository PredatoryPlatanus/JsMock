(function(){
	'use strict';
	/**
	* app Module
	*
	* Description
	*/
	angular.module('app', []).controller('derpController',
		['$scope', 'service', function($scope, service){
			$scope.serviceCall = function(){
				$scope.serviceCallResult = service.call();				
			};

			$scope.serviceCallPromise = function(){
				service.callPromise().then(function(value){
					$scope.promiseResult = value;
				});
			};
		}]).service('service', ['$q', function($q){
			var text = 'This should not been returned';
			this.call = function () {
				return text;				
			};

			this.callPromise = function(){
				$q.resolve(text);
			};
		}]);
	})();