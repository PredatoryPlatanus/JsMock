// Minimal js mocking framework for angularJs
(function (exports) {
    'use strict';

    exports.mockFunc = function (funcName) {

        var limitCalls = null;
        var callCount = 0;
        var calledWith = null;

        var globalResponse = null;
        var behaviours = null;

        var delegate = function () {
            ++delegate.callCount;
            checkCallLimit();

            delegate.calledWith.push(serializeArgs(arguments));

            return getResponse(arguments);
        };

        delegate.callCount = 0;
        delegate.calledWith = [];

        function checkCallLimit() {
            if (limitCalls !== null && delegate.callCount > limitCalls) {
                throw "'" + funcName + "' has been called more than " + limitCalls + " times";
            }
        }

        function getResponse(args) {
            var response;

            if (behaviours === null) response = globalResponse;
            else {
                var match = findBehaviourByArgs(args);
                if (match === null) {
                    // simple matching, arguments order DOES make a difference, to be redone
                    var allBehaviours = behaviours.map(function (e) {
                        return e.arguments;
                    });
                    // show mocked arg variants in error
                    throw new funcName + ' was called with unexpected arguments';
                }

                response = match.response;
            }

            if (typeof (response) === 'function')
                response = response.apply(this, args);

            return response;
        }

        function findBehaviourByArgs(args) {
            var argsString = serializeArgs(args);
            return find(behaviours, function (b) {
                return b.args == argsString;
            });
        }

        function serializeArgs(args) {
            //make calledWith readable
            return JSON.stringify(args);
        }

        delegate.whenCalled = function (args) {
            if (behaviours === null) behaviours = [];

            var behaviour = {
                arguments: serializeArgs(args),
                response: null
            };

            behaviours.push(behaviour);
        };

        delegate.returns = function (value) {
            if (behaviours === null) globalResponse = value;
            else behaviours[behaviours.length - 1].response = value;

            return delegate;
        };

        delegate.returnsPromise = function (value) {
            return delegate.returns(successPromise(value));
        };

        delegate.rejectsPromise = function (value) {
            return delegate.returns(rejectPromise(value));
        };

        delegate.limit = function (limit) {
            limitCalls = limit;
            return delegate;
        };

        delegate.once = function () {
            return this.limit(1);
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

    function areEqual(obj1, obj2) {
        //rough comparison, to be changed
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