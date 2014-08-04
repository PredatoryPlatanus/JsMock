'use strict';

/* jasmine specs for JsMock go here */
describe('JsMock tests.', function(){
	var $httpBackend, $scope, controller, mockedFunc, service;
	beforeEach(function(){
		module('app');
		inject(function($rootScope, $controller, _$httpBackend_){
			$httpBackend = _$httpBackend_;
			$scope = $rootScope.$new();
			service = {};

			controller = $controller('derpController', {$scope: $scope, service: service });
		});
	});

	describe('When not using whenCalled aruments matcher.', function(){
		var expectedValue = "mocked";

		describe('And mocking simple return value', function(){
			beforeEach(function(){
				service.call = mockFunc('call').returns(expectedValue);
			});

			it('should return mockedValue', function(){
				$scope.serviceCall();
				expect($scope.serviceCallResult).toBe(expectedValue);
			});
		});

		describe('And mocking success promise value', function(){
			beforeEach(function(){
				service.callPromise = mockFunc('call').returnsPromise(expectedValue);
			});

			it('should return mockedValue', function(){
				$scope.serviceCallPromise();
				$scope.$digest();
				expect($scope.promiseResult).toBe(expectedValue);
			});
		});
	});
});