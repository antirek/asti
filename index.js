'use strict';

var http = require('http');
var Joi = require('joi');
var socket_io = require('socket.io');


var ConfigSchema = require('./lib/configSchema');
var Asterisk = require('./lib/asterisk');
var Router = require('./lib/router');
var Pool = require('./lib/pool');
var Client = require('./lib/client');
var AgentEventsHandler = require('./lib/agentEventsHandler');

var Server = function (config) {

    var validate = function (callback) {
      Joi.validate(config, ConfigSchema, callback);
    };

    var init = function () {

      var appendListeners = function (io) {
        io.on('connection', function (socket) {
          var client = new Client({socket: socket});
                
          client.on('subscribeAgentEvents', function (data) {
            console.log(data);
            pool.addClient(data.agent, client);
          });

          client.on('unsubscribeAgentEvents', function (data) {
            pool.removeClient(client);
          });

        });
      };

      var asterisk = new Asterisk(config.ami);
      var router = new Router(asterisk);

      var pool = new Pool();      
      var handler = new AgentEventsHandler(pool, config.ami.version);
      
      asterisk.on('agentcalled', handler.handle);
      asterisk.on('agentcomplete', handler.handle);
      asterisk.on('agentconnect', handler.handle);
      asterisk.on('agentringnoanswer', handler.handle);


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