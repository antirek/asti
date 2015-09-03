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
		emitter.on(evt, callback)
	};

	var emit = function (evt, data) {
		emitter.emit(evt, data);
	};

	var getId = function () {
		return id;
	};

	var init = function () {
		socket.on('subscribe', function (data) {
			emit('subscribe', data);
		});

		socket.on('unsubscribe', function (data) {
			emit('unsubscribe', data);
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