'use strict';
var console = require('tracer').colorConsole();
var Client = require('./client');

var appendListeners = function (io, pool, queueCommand, urlFetcher, call) {
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
          client.emitToSocket('queue:list', {actionid: actionid, data: queues, status: 'ok'});
        })
        .fail(function (err) {
          client.emitToSocket('queue:list', {actionid: actionid, data: err, status: 'error'});
        });
    });

    client.on('queue:members', function (data) {
      var actionid = data.actionid;
      queueCommand.queueMembers(data)
        .then(function (members) {
          client.emitToSocket('queue:members', {actionid: actionid, data: members, status: 'ok'});
        })
        .fail(function (err) {
          client.emitToSocket('queue:members', {actionid: actionid, data: err, status: 'error'});
        });
    });


    client.on('call', function (data) {
      var actionid = data.actionid;
      var tracking = data.tracking || '';
      call.originate(data, client)
        .then(function (res) {          
          client.emitToSocket('call', {actionid: actionid, tracking: tracking, data: res, status: 'ok'});
        })
        .fail(function (err) {
          client.emitToSocket('call', {actionid: actionid, tracking: tracking, data: err, status: 'error'});
        });
    });
  });
};

module.exports = appendListeners;