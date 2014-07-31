// Minimal js mocking framework
(function (exports) {
    'use strict';

    exports.Mock = function () {
        var _mock = {
            raiseFail: function (message) {
                throw new Error(message);
            },
            use: function (obj) {
                if(!obj) obj = {};
                obj.mock = function (name) {
                    if(!obj[name]) obj[name] = function(){};
                    if (obj[name].original) {
                        _mock.raiseFail("Function '" + name + "' is already stubbed. call restore for remocking");
                    }
                    var atMostLimit = null;
                    var original = obj[name];
                    var returnValue = undefined;
                    var isPromise = false;
                    var isRejected = false;

                    obj[name] = function () {
                        ++obj[name].callCount;
                        if (atMostLimit != null && atMostLimit < callCount) {
                            _mock.raiseFail("'" + name + "'has been called more than " + atMostLimit + "times");
                        }

                        var argObj = [];

                        for (var i = 0; i < arguments.length; i++) {
                            argObj.push(arguments[i]);
                        }
                        obj[name].calledWith = argObj;

                        var result;
                        if(typeof (returnValue) === 'function'){
                            result = returnValue.apply(obj, arguments);
                        }
                        else{
                            result = returnValue;
                        }

                        if(isPromise){
                            return isRejected ? rejectPromise(result) : successPromise(result);
                        }

                        return result;
                    };

                    obj[name].callCount = 0;
                    obj[name].calledWith = [];
                    obj[name].returns = function(value){
                        returnValue = value;

                        return obj[name];
                    }
                    obj[name].returnsPromise = function(value){
                        isPromise = true;

                        return obj[name].returns(value);
                    }

                    obj[name].rejectsPromise = function(value){
                        isPromise = true;
                        isRejected = false;

                        return obj[name].returns(value);
                    }

                    obj[name].throws = function(error){
                        throw new error;
                    }

                    obj[name].once = function(){
                        atMostLimit = 1;

                        return obj[name];
                    }
                    obj[name].original = original;
                    obj[name].restore = function () {
                        if (!!obj[name].original) {
                            obj[name] = obj[name].original;
                            delete obj[name].original;
                            delete obj[name].restore;
                            delete obj[name].reset;

                            delete obj[name].calledWith;
                            delete obj[name].callCount;

                            delete obj[name].returns;
                            delete obj[name].callback;
                        }
                        return obj;
                    };
                    obj[name].reset = function() {
                        obj[name].callCount = 0;
                        obj[name].calledWith = undefined;
                    };
                    obj[name].atMost = function (n) {
                        atMostLimit = n;
                        return obj[name];
                    };

                    return obj[name];
                };
                return obj;
            }
        };
        return _mock;
    }();
}(window)); 