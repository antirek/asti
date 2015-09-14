'use strict';

var Client = require('./client');

var appendListeners = function (io, pool, queueCommand, urlFetcher) {
  io.on('connection', function (socket) {
    var client = new Client({
      socket: socket, 
      urlFetcher: urlFetcher
    });

    client.on('agent:subscribe', function (data) {
      console.log(client.getIdentity(), data);
      pool.addClient(data.agent, client);
    });

    client.on('agent:unsubscribe', function (data) {
      pool.removeClient(client);
    });


    client.on('queue:list', function (data) {
      var actionid = data.actionid;
      queueCommand.queueList()
        .then(function (queues) {
          client.emitToSocket('queue:list', {actionid: actionid, data: queues});
        })
        .fail(function (err) {
          client.emitToSocket('error', err);
        });
    });


    client.on('queue:members', function (data) {
      var actionid = data.actionid;
      queueCommand.queueMembers(data)
        .then(function (members) {
          client.emitToSocket('queue:members', {actionid: actionid, data: members});
        })
        .fail(function (err) {
          client.emitToSocket('error', err);
        });
    });

  });
};

module.exports = appendListeners;