// Minimal js mocking framework for angularJs
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
            ++delegate.callCount;
            if (atMostLimit !== null && delegate.callCount > atMostLimit) {
                throw funcName + "'has been called more than " + atMostLimit + " times";
            }

            delegate.calledWith.push(serializeArgs(arguments));

            return getResponse(arguments);
        };

        delegate.callCount = 0;
        delegate.calledWith = [];

        function getResponse(args){
            var response;
            var argsString = serializeArgs(args);

            if(behaviours === null) response = globalResponse;
            else {
                var match = find(behaviours, function(b){ return b.args == argsString; });
                if(match === null){
                    // simple matching, arguments order DOES make a difference, to be redone
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

        function serializeArgs(args){
            //make calledWith readable
            return JSON.stringify(args);
        }

        delegate.whenCalled = function(args){
            if(behaviours === null){
                behaviours = [];
            }
            var behaviour = {
                arguments: serializeArgs(args),
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