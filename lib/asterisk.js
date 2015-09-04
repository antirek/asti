'use strict';

var AsteriskManager = require('asterisk-manager');
var Q = require('q');

var asterisk = function (pool, config) {
    var conf = config.ami;
    var amiConnection = new AsteriskManager(conf.port, conf.host, conf.username, conf.password, true); 
    amiConnection.keepConnected();
     
    var handler = function (evt) {
        console.log(evt);
        var agent = evt[config.key_field];
        console.log(agent);
        var clients = pool.getClients(agent);
        
        if (clients) {
            clients.forEach(function (client, key){
                client.emitToSocket(evt.event.toLowerCase(), evt);
            });
        };
    };

    amiConnection.on('agentcalled', handler);
    amiConnection.on('agentcomplete', handler);
    amiConnection.on('agentconnect', handler);
    amiConnection.on('agentdump', handler);
    amiConnection.on('agentringnoanswer', handler);

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