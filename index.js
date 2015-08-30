
var AsteriskManager = require('asterisk-manager');
var Router = require('node-simple-router');
var http = require('http');
var Q = require('q');
var ConfigSchema = require('./lib/configSchema');
var Joi = require('joi');

var Server = function (config) {
  var ami = new AsteriskManager(config.asterisk.port, config.asterisk.host, config.asterisk.username, config.asterisk.password, true);
  ami.keepConnected();

  var validate = function (callback) {
    Joi.validate(config, ConfigSchema, callback);
  };

  var originate = function (channel, context, exten, variable, callback) {
    ami.action({
      'action': 'originate',
      'channel': channel,
      'context': context,
      'exten': exten,
      'priority': 1,
      'variable': variable
    }, callback);
  };

  var router = Router({
      static_route: __dirname + "/public",
      logging: true
  });

  var required = function (params) {
    var result = true;
    if (!params['channel']) {result = false; console.log('channel', params['channel']);}
    if (!params['context']) {result = false; console.log('contex', params['contex']);}
    if (!params['exten']) {result = false; console.log('exten', params['exten']);}
    //if (!params['variable']) {result = false; console.log('variable', params['variable']);}
    return result;
  };

  router.get("/call", function (request, response) {
    var params = request.get;    
    response.setHeader('Access-Control-Allow-Origin', '*');

    console.log('params', params);
    if (required(params)) {    
      var variable = (params.variable) ? params.variable : '';
      originate(params.channel, params.context, params.exten, params.variable, function (err, res) {
        if (err) {
          console.log('error', err);
          response.end(JSON.stringify(err));
        } else {
          console.log('response', res);
          response.end(JSON.stringify(res));
        }      
      });
    } else {
      response.end('Not all params');
    }
  });


  var start = function () {
    validate(function (err, value) {
      if (err) {
        console.log('config.js have errors', err);
      } else {
        console.log('config.js validated successfully!');
        http.createServer(router).listen(config.web.port, config.web.host);
      }
    });    
  };

  return {
    start: start
  };
};

module.exports = Server;