'use strict';

var Client = require('./client');

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

module.exports = appendListeners;