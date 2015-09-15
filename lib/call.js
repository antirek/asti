'use strict';

var Q = require('q');
var uuid = require('node-uuid');

var Call = function (amiConnection) {

    var eventListener = function (userevent, actionid, callback) {
        return function (evt) {
            if (evt.userevent == userevent && evt.actionid == actionid) {
                callback(evt);
            }
        };
    };

	var originate = function (params, client) {
        
        var actionid = params.actionid || uuid.v4();
        var defer = new Q.defer();
        
        if(!params.channel) defer.reject(new Error('No channel param'));
        if(!params.context) defer.reject(new Error('No context param'));
        if(!params.exten) defer.reject(new Error('No exten param'));
        if(!params.variable) params.variable = {};

        params.variable['ORIGINATE_ACTIONID'] = actionid;

        var options = {
            'action': 'originate',
            'channel': params.channel,
            'context': params.context,
            'exten': params.exten,
            'priority': 1,
            'async': true,
            'variable': params.variable
        };

        var removedListener1 = false,
            removedListener2 = false;

        var listener1 = new eventListener('answer1', actionid, function (evt) {
            amiConnection.removeListener('userevent', listener1);
            removedListener1 = true;
            console.log('answer1', evt.actionid);
            client.emitToSocket('answer1', {actionid: actionid, data: evt});
        });

        var listener2 = new eventListener('answer2', actionid, function (evt) {
            amiConnection.removeListener('userevent', listener2);
            removedListener2 = true;
            console.log('answer2', evt.actionid);
            client.emitToSocket('answer2', {actionid: actionid, data: evt});
        });

        //если listener'ы не сработают в течении 120 сек, удаляем их принудительно
        setTimeout(function () {
            if (!removedListener1) {amiConnection.removeListener('userevent', listener1);}
            if (!removedListener2) {amiConnection.removeListener('userevent', listener2);}
        }, 120000);
        
        amiConnection.on('userevent', listener1);
        amiConnection.on('userevent', listener2);
        
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