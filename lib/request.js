'use strict';

//var post = require('http-post');
var req = require('request');
var Q = require('q');

var Request = function (settings) {

  var options = {
    baseUrl: settings.baseUrl
  };

  var send = function (evt, data) {    
    var url = options.baseUrl + evt;
    console.log('url', url);  
    req.post(url)
      .form(data)
      .on('response', function (res) {
        console.log('request resp', data, res.statusCode);
      })
      .on('error', function (err) {
        console.log('request err', err);
      });
  };

  return {
    send: send
  };
};

module.exports = Request;