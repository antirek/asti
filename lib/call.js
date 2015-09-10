'use strict';

var Q = require('q');

var Call = function (amiConnection) {

	var originate = function (params) {
        var defer = Q.defer();
        if(!params.channel) defer.reject(new Error('No channel param'));
        if(!params.context) defer.reject(new Error('No context param'));
        if(!params.exten) defer.reject(new Error('No exten param'));
        if(!params.variable) params.variable = '';

        var options = {
            'action': 'originate',
            'channel': params.channel,
            'context': params.context,
            'exten': params.exten,
            'priority': 1,
            'variable': params.variable
        };
        
        amiConnection.action(options, function (error, result) {            
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