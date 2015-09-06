# asti

proxy between asterisk and web-client

send http-request and make orginate via AMI to asterisk

## Install

> npm install asti


## Usage

`````javascript

fetch('http://host:port/call?channel=Local/100@default&context=from-internal&exten=89135292926');


`````


## Config

`````javascript 

{
  asterisk: {       //asterisk manager connection
    port: 5038,
    host: 'localhost',
    username: 'amiadmin',
    password: 'amipassword'
  },
  web: {
    port: 10000,        //port of web-interface
    host: '127.0.0.1'   //not required
  }
}

`````