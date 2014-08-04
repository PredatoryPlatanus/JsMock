// Minimal js mocking framework for qunit+angularJs
(function (exports) {
    'use strict';

    exports.mockFunc = function(funcName) {

        var atMostLimit = null;
        var callCount = 0;
        var calledWith = null;

        var isPromise = false;
        var isRejected = false;        

        var globalResponse = null;
        var behaviours = null;

        var delegate = function () {
            ++callCount;
            if (atMostLimit !== null && atMostLimit < callCount) {
                _mock.raiseFail("'" + funcName + "'has been called more than " + atMostLimit + "times");
            }

            calledWith = JSON.stringify(arguments);

            return getResponse(arguments);
        };

        function getResponse(args){
            var response;
            var argsString = JSON.stringify(args);

            if(behaviours === null) response = globalResponse;
            else {
                var match = find(behaviours, function(b){ return b.args == argsString; });
                if(match === null){
                    var allBehaviours = behaviours.map(function(e){ return e.arguments;});

                    throw new funcName +' was called with unexpected arguments';
                }

                response = match.response;
            }

            if(typeof (response) === 'function'){
                response = response.apply(this, args);
            }

            if(isPromise){
                return isRejected ? rejectPromise(response) : successPromise(response);
            }

            return response;
        }

        delegate.whenCalled = function(args){
            if(behaviours === null){
                behaviours = [];
            }
            var behaviour = {
                arguments: JSON.stringify(args),
                response: null
            };

            behaviours.push(behaviour);
        };

        delegate.returns = function(value){
            if(behaviours === null) globalResponse = value;
            else behaviours[behaviours.length - 1].response = value;

            return delegate;
        };

        delegate.returnsPromise = function(value){
            isPromise = true;

            return delegate.returns(value);
        };

        delegate.rejectsPromise = function(value){
            isPromise = true;
            isRejected = false;

            return delegate.returns(value);
        };

        delegate.once = function(){
            atMostLimit = 1;

            return delegate;
        };


        return delegate;
    };

    function successPromise(result) {
        var $q;
        inject(function (_$q_) {
            $q = _$q_;
        });
        var deferred = $q.defer();
        deferred.resolve(result);

        return deferred.promise;
    }

    function rejectPromise(result) {
        var $q;
        inject(function (_$q_) {
            $q = _$q_;
        });

        var deferred = $q.defer();
        deferred.reject(result);

        return deferred.promise;
    }

    function areEqual(obj1, obj2){
        //rough comparison
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    function find(array, predicate) {

        for (var i = 0, len = array.length; i < len; i++) {

            var matchFound = predicate(array[i]);
            if (matchFound)
                return array[i];
        }

        return null;
    }

}(window)); 