'use strict';

var http = require('http');
var Joi = require('joi');
var socket_io = require('socket.io');


var ConfigSchema = require('./lib/configSchema');
var AmiConnection = require('./lib/amiConnection');
var Router = require('./lib/router');
var Pool = require('./lib/pool');
var Client = require('./lib/client');
var AgentEventsHandler = require('./lib/agentEventsHandler');
var Call = require('./lib/call');

var Server = function (config) {

    var validate = function (callback) {
      Joi.validate(config, ConfigSchema, callback);
    };

    var init = function () {

      var appendListeners = function (io, pool) {
        io.on('connection', function (socket) {
          var client = new Client({socket: socket});
                
          client.on('agent:subscribe', function (data) {
            console.log(data);
            pool.addClient(data.agent, client);
          });

          client.on('agent:unsubscribe', function (data) {
            pool.removeClient(client);
          });

        });
      };

      var amiConnection = new AmiConnection(config.ami);
      var call = new Call(amiConnection);
      var router = new Router(call);

      var pool = new Pool();
      var handler = new AgentEventsHandler(amiConnection, pool, config.ami.version);


      var app = http.createServer(router);
      var io = socket_io(app);
      app.listen(config.web.port, config.web.host);
      appendListeners(io, pool);

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