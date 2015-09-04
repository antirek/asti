'use strict';

var SimpleRouter = require('node-simple-router');
var fs = require('fs');
var Q = require('q');

var Router = function (asterisk) {
    var router = SimpleRouter({
        static_route: __dirname + "/public",
        logging: true
    });

    var required = function (params) {        
        if (!params['channel']) {Q.reject(new Error('No param channel'));}
        if (!params['context']) {Q.reject(new Error('No param context'));}
        if (!params['exten']) { Q.reject(new Error('No param exten'));}
        return Q.resolve();
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
        required(params)
            .then(function () {
                var variable = (params.variable) ? params.variable : '';
                return asterisk.originate(params.channel, params.context, params.exten, params.variable);
            })
            .then(function (result) {
                console.log(result);
                response.end(JSON.stringify(result));
            })
            .catch(function (error) {
                console.log('error', error);
                response.end(JSON.stringify(error));
            });
    });

    return router;
};

module.exports = Router;