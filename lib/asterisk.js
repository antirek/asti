'use strict';

var AsteriskManager = require('asterisk-manager');
var Q = require('q');

var asterisk = function (pool, config) {
    var conf = config.ami;
    var amiConnection = new AsteriskManager(conf.port, conf.host, conf.username, conf.password, true); 
    amiConnection.keepConnected();


    var agentFromEvent = function (evt, version) {
        var key;
        if (version == '1.8') {
            switch (evt['event']) {
                case 'AgentCalled': 
                    key = 'agentcalled';
                    break;
                case 'AgentConnect':
                case 'AgentComplete':
                case 'AgentRingNoAnswer':
                default: 
                    key = 'member';
                    break;
            };
        } else if (version == '11') {
            switch (evt['event']) {
                case 'AgentCalled':
                case 'AgentConnect':
                case 'AgentComplete':
                case 'AgentRingNoAnswer':
                default: 
                    key = 'agent';
            }
        }
        return evt[key];
    }
     
    var handlerAgentEvents = function (evt) {

        var agent = agentFromEvent(evt, conf.version);
        console.log(agent, evt);
        
        var clients = pool.getClients(agent);
        
        if (clients) {
            clients.forEach(function (client, key) {
                client.emitToSocket(evt.event.toLowerCase(), evt);
            });
        };
    };

    amiConnection.on('agentcalled', handlerAgentEvents);
    amiConnection.on('agentcomplete', handlerAgentEvents);
    amiConnection.on('agentconnect', handlerAgentEvents);
    amiConnection.on('agentdump', handlerAgentEvents);
    amiConnection.on('agentringnoanswer', handlerAgentEvents);

    amiConnection.on('agentlogin', handlerAgentEvents);
    amiConnection.on('agentlogoff', handlerAgentEvents);

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