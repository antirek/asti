'use strict';

var Client = require('./client');

var appendListeners = function (io, pool, queueCommand) {
  io.on('connection', function (socket) {
    var client = new Client({socket: socket});

    client.on('agent:subscribe', function (data) {
      console.log(data);
      pool.addClient(data.agent, client);
    });

    client.on('agent:unsubscribe', function (data) {
      pool.removeClient(client);
    });

    client.on('queue:list', function () {

      queueCommand.queueList()
        .then(function (queues) {
          
          client.emitToSocket('queue:list', queues);
        })
        .fail(function (err) {
          client.emitToSocket('error', err);
        });

    });

    client.on('queue:members', function (data) {

      queueCommand.queueMembers(data)
        .then(function (members) {
          
          client.emitToSocket('queue:members', members);
        })
        .fail(function (err) {
          client.emitToSocket('error', err);
        });

    });

  });
};

module.exports = appendListeners;