'use strict';

var SimpleRouter = require('node-simple-router');
var fs = require('fs');

var Router = function (asterisk) {
    var router = SimpleRouter({
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

    router.get("/", function (request, response) {
        fs.readFile(__dirname + '/../index.html', function (err, data) {
            if (err) {
              response.writeHead(500);
              return response.end(err.toString());
            }
            response.writeHead(200);
            response.end(data);
        });
    });

    router.get("/call", function (request, response) {
        var params = request.get;    
        response.setHeader('Access-Control-Allow-Origin', '*');

        console.log('params', params);
        if (required(params)) {    
          var variable = (params.variable) ? params.variable : '';
          asterisk.originate(params.channel, params.context, params.exten, params.variable, function (err, res) {
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

    return router;
};

module.exports = Router;