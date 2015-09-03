'use strict';

var AsteriskManager = require('asterisk-manager');
var http = require('http');
var Joi = require('joi');
var socket_io = require('socket.io');


var ConfigSchema = require('./lib/configSchema');
var Asterisk = require('./lib/asterisk');
var Router = require('./lib/router');
var Pool = require('./lib/pool');
var Client = require('./lib/client');


var Server = function (config) {

    var pool = new Pool();
    var asterisk = new Asterisk(pool, config.asterisk);

    var validate = function (callback) {
        Joi.validate(config, ConfigSchema, callback);
    };

    var router = new Router(asterisk);

    var appendListeners = function (io) {
      io.on('connection', function (socket) {
        var client = new Client({socket: socket});
              
        client.on('subscribe', function (data) {
          pool.addClient(data.interface, client);
        });

        client.on('unsubscribe', function (data) {
          pool.removeClient(client);
        });
      });
    };

    var start = function () {
        validate(function (err, value) {
            if (err) {
                console.log('config.js have errors', err);
            } else {
                console.log('config.js validated successfully!');
                var app = http.createServer(router);
                var io = socket_io(app);
                app.listen(config.web.port, config.web.host);
                appendListeners(io);
            }
        });
    };

    return {
      start: start
    };

};

module.exports = Server;