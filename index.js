'use strict';

var http = require('http');
var Joi = require('joi');
var socket_io = require('socket.io');


var ConfigSchema = require('./lib/configSchema');
var Asterisk = require('./lib/asterisk');
var Router = require('./lib/router');
var Pool = require('./lib/pool');
var Client = require('./lib/client');


var Server = function (config) {

    var validate = function (callback) {
      Joi.validate(config, ConfigSchema, callback);
    };

    var init = function () {

      var appendListeners = function (io) {
        io.on('connection', function (socket) {
          var client = new Client({socket: socket});
                
          client.on('subscribe', function (data) {
            console.log(data);
            pool.addClient(data.agent, client);
          });

          client.on('unsubscribe', function (data) {
            pool.removeClient(client);
          });
        });
      };

      var pool = new Pool();
      var asterisk = new Asterisk(pool, config);
      var router = new Router(asterisk);

      var app = http.createServer(router);
      var io = socket_io(app);
      app.listen(config.web.port, config.web.host);
      appendListeners(io);
   
    };

    var start = function () {
      validate(function (error) {
        if (error) {
          console.log('config.js have errors', error);
        } else {
          console.log('config.js validated successfully!');
          init();
        }
      });
    };

    return {
      start: start
    };
};

module.exports = Server;