'use strict';

var AsteriskManager = require('asterisk-manager');
var Q = require('q');

var amiConnection = function (config) {
    var ami = new AsteriskManager(config.port, config.host, config.username, config.password, true); 
    ami.keepConnected();

    return ami;
};

module.exports = amiConnection;