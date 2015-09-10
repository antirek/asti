'use strict';

var Call = function (amiConnection) {

	var originate = function (params) {
        var defer = Q.defer();
        if(!params.channel) defer.reject(new Error('No channel param'));
        if(!params.context) defer.reject(new Error('No context param'));
        if(!params.exten) defer.reject(new Error('No exten param'));
        if(!params.variable) defer.reject(new Error('No variable param'));

        var options = {
            'action': 'originate',
            'channel': channel,
            'context': context,
            'exten': exten,
            'priority': 1,
            'variable': variable
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