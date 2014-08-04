'use strict';

/* jasmine specs for JsMock go here */
describe('JsMock tests', function(){
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

	describe('When not using whenCalled arg macher', function(){
		var expectedValue = "mocked";
		beforeEach(function(){
			service.call = mockFunc('call').returns(expectedValue);
		});

		it('should return mockedValue', function(){
			$scope.serviceCall();
			expect($scope.serviceCallResult).toBe(expectedValue);
		});
	});
});