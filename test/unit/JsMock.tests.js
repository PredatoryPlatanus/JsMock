'use strict';

/* jasmine specs for JsMock go here */
describe('JsMock tests.', function(){
	var $httpBackend, $scope, controller, service;
	beforeEach(function(){
		module('app');
		inject(function($rootScope, $controller, _$httpBackend_){
			$httpBackend = _$httpBackend_;
			$scope = $rootScope.$new();
			service = {};

			controller = $controller('derpController', {$scope: $scope, service: service });
		});
	});

	describe('When not using arguments matcher.', function(){
		var expectedValue = "mocked";
		var args = { id:5, text:'derp' };

		describe('And mocking simple return value', function(){
			beforeEach(function(){
				service.call = mockFunc('call').returns(expectedValue);
				$scope.serviceCall(args);
			});

			it('should return mockedValue', function(){	
				expect($scope.serviceCallResult).toBe(expectedValue);
			});

			it('should have correct callCount', function(){
				expect(service.call.callCount).toBe(1);
			});

			it('should have correct calledWith', function(){
				//make calledWith readable
				expect(service.call.calledWith[0]).toBe('{"0":{"id":5,"text":"derp"}}');
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