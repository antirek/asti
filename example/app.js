
var Server = require('../index');
var config = require('./config');

var server = new Server(config);
server.start();