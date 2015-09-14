'use strict';

var post = require('http-post');
var Q = require('q');

var Request = function (settings) {

  var options = {
    baseUrl: settings.baseUrl
  };

  var send = function (evt, data) {    
    var url = options.baseUrl + evt;
    console.log('url', url);  
    post(url, data, function (res) {
      console.log('resp', data, res.statusCode);
    });
  };

  return {
    send: send
  };
};

module.exports = Request;