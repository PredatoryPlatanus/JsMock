(function(){
	'use strict';
	/**
	* app Module
	*
	* Description
	*/
	angular.module('app', []).controller('derpController',
		['$scope', 'service', function($scope, service){
			$scope.serviceCall = function(args){
				$scope.serviceCallResult = service.call(args);				
			};

			$scope.serviceCallPromise = function(args){
				service.callPromise(args).then(function(value){
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