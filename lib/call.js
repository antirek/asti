'use strict';

var Call = function (amiConnection) {

	var originate = function (channel, context, exten, variable) {
        var defer = Q.defer();
        amiConnection.action({
            'action': 'originate',
            'channel': channel,
            'context': context,
            'exten': exten,
            'priority': 1,
            'variable': variable
        }, function (error, result) {            
            if (error) {
               defer.reject(error);
            } else {
               defer.resolve(result);
            }
        });
        return defer.promise;
    };

    return {
        originate: originate
    };
};

module.exports = Call;