
var AsteriskManager = require('asterisk-manager');
var Router = require('node-simple-router');
var http = require('http');
var Q = require('q');

var config = {
  node: {
    port: 5038,
    host: 'localhost',
    username: 'admin',
    password: 'amp111'
  },
  port: 10000
};

var ami = new AsteriskManager(config.node.port, config.node.host, config.node.username, config.node.password, true);

ami.keepConnected();

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
}

router.get("/call", function (request, response) {
  var params = request.get;
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

http.createServer(router).listen(config.port);