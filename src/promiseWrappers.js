(function (exports) {
    'use strict';
    
    exports.successPromise = function(result) {
        var $q;
        inject(function (_$q_) {
            $q = _$q_;
        });
        var deferred = $q.defer();
        deferred.resolve(result);

        return deferred.promise;
    };

    exports.rejectPromise = function(result){
        var $q;
        inject(function (_$q_) {
            $q = _$q_;
        });

        var deferred = $q.defer();
        deferred.reject(result);

        return deferred.promise;
    }

    exports.newId = function() {
        return Math.floor(Math.random() * 1000 + 1);
    };

})(window)