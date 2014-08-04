/* jasmine specs for JsMock go here */
describe('JsMock tests.', function(){
	var $httpBackend, $scope, controller, service;
	beforeEach(function(){
		module('app');
		inject(function($rootScope, $controller){
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

		describe('And restricted by once()', function(){
			beforeEach(function(){
				service.call = mockFunc('call').returns(expectedValue).once();
			});

			it('should fail on second call', function(){
				expect(service.call).not.toThrow();
				expect(service.call).toThrow();
			});
		});

		describe('And restricted to three calls', function(){
			beforeEach(function(){
				service.call = mockFunc('call').returns(expectedValue).limit(3);
			});

			it('should fail on second call', function(){
				expect(service.call).not.toThrow();
				expect(service.call).not.toThrow();
				expect(service.call).not.toThrow();
				expect(service.call).toThrow();
			});
		});

		describe('And mocking success promise value', function(){
			beforeEach(function(){
				service.callPromise = mockFunc('call').returnsPromise(expectedValue);
				$scope.serviceCallPromise();
				$scope.$digest();
			});

			it('should return mockedValue', function(){
				expect($scope.promiseResult).toBe(expectedValue);
			});
		});

		describe('And mocking reject promise value', function(){
			var expectedReject = 'rejectedValue';
			beforeEach(function(){
				service.callPromise = mockFunc('call').rejectsPromise(expectedReject);
				$scope.serviceCallPromise();
				$scope.$digest();
			});

			it('should return rejected value', function(){
				expect($scope.promiseError).toBe(expectedReject);
			});
		});

	});
});