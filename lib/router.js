'use strict';

var SimpleRouter = require('node-simple-router');
var Q = require('q');

var Router = function (call) {
    var router = SimpleRouter({
        static_route: __dirname + "/public",
        logging: true
    });    

    router.get("/call", function (request, response) {
        var params = request.get;    
        response.setHeader('Access-Control-Allow-Origin', '*');

        console.log('params', params);
        
        params.variable = params.variable || '';
        call.originate(params)
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