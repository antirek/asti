'use strict';

var AsteriskManager = require('asterisk-manager');
var Q = require('q');

var asterisk = function (pool, config)  {
    var amiConnection = new AsteriskManager(config.port, config.host, config.username, config.password, true); 
    amiConnection.keepConnected();
     
    var handler = function (evt) {
        console.log(evt);
        
        var clients = pool.getClients(evt.interface);
        
        if (clients) {
            clients.forEach(function (client, key){
                client.emitToSocket(evt.event.toLowerCase(), evt);
            })
        };      
    };

    amiConnection.on('agentcalled', handler);
    amiConnection.on('agentcomplete', handler);
    amiConnection.on('agentconnect', handler);
    amiConnection.on('queuecallerabandon', handler);


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
            console.log(error, result);
            if (error) {
                defer.reject(error);
            } else {
                defer.resolve(result)
            }
        });
        return defer.promise;
    };

    return {
        originate: originate
    };
};

module.exports = asterisk;