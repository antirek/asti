'use strict';

var AsteriskManager = require('asterisk-manager');
var Q = require('q');

var AgentEventsHandler = require('./agentEventsHandler');

var asterisk = function (pool, config) {
    var conf = config.ami;
    var amiConnection = new AsteriskManager(conf.port, conf.host, conf.username, conf.password, true); 
    amiConnection.keepConnected();


    var handler = new AgentEventsHandler(pool, conf);

    amiConnection.on('agentcalled', handler.handle);
    amiConnection.on('agentcomplete', handler.handle);
    amiConnection.on('agentconnect', handler.handle);
    amiConnection.on('agentringnoanswer', handler.handle);




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