'use strict';

var AmiConnection = require('./lib/amiConnection');

var config = {
    port: 5038,
    host: '192.168.242.125',
    username: 'amiadmin',
    password: '123456',
    version: '1.8'
  };

var ami = new AmiConnection(config);

 var options = {
            'action': 'originate',
            'channel': 'Local/100@user',
            'context': 'internal',
            'exten': '89135292926',
            'priority': 1,
            'async': true,
            'variable': 'userkey=qhkl7ll3zwzu45t9',            
        };

ami.action(options, function (error, result) {
    console.log(error, result)
});