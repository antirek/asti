'use strict';

var EventEmitter = require('events').EventEmitter;
var uuid = require('node-uuid');

var Client = function (obj) {

	var socket = obj.socket;
	var emitter = new EventEmitter();
	var id = uuid.v4();

	var emitToSocket = function (evt, data) {
		socket.emit(evt, data);
	};

	var onSocketEvent = function (evt, callback) {
		socket.on(evt, callback);
	};

	var on = function (evt, callback) {
		emitter.on(evt, callback);
	};

	var emit = function (evt, data) {
		emitter.emit(evt, data);
	};

	var getId = function () {
		return id;
	};

	var init = function () {
		socket.on('agent:subscribe', function (data) {
			emit('agent:subscribe', data);
		});

		socket.on('agent:unsubscribe', function (data) {
			emit('agent:unsubscribe', data);
		});

		socket.on('queue:list', function (data) {
			emit('queue:list', data);
		});

		socket.on('queue:members', function (data) {
			emit('queue:members', data);
		});

	}();

	return {
		emit: emit,
		on: on,
		getId: getId,
		emitToSocket: emitToSocket,
		onSocketEvent: onSocketEvent
	};
};

module.exports = Client;