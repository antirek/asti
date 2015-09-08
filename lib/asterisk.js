'use strict';

var AsteriskManager = require('asterisk-manager');
var Q = require('q');

var asterisk = function (config) {
    var amiConnection = new AsteriskManager(config.port, config.host, config.username, config.password, true); 
    amiConnection.keepConnected();

    return amiConnection;
};

module.exports = asterisk;