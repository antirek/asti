# asti

proxy between asterisk and web-client for integration


## Install

> npm install asti --save


## Usage

Use client lib - asti.js [https://github.com/antirek/asti.js]



## Config

`````javascript 

{
  asterisk: {       //asterisk manager connection
    port: 5038,
    host: 'localhost',
    username: 'amiadmin',
    password: 'amipassword',
    version: '11'   // also ['1.8', '11', '13']
  },
  web: {
    port: 10000,        //port of web-interface
    host: '127.0.0.1'   //not required, for any 0.0.0.0
  }
}

`````