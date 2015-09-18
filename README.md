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

## Originate

Work asterisk dialplan:

`````sh

[outbound1]
exten=>_X.,1,Dial(SIP/${EXTEN},,U(pretech,answer1,${ORIGINATE_ACTIONID}))

[outbound2]
exten=>_X.,1,Dial(SIP/${EXTEN},,U(pretech,answer2,${ORIGINATE_ACTIONID}))

[pretech]
exten=s,1,NoOp(pretech)
exten=s,n,UserEvent(${ARG1},actionid:${ARG2}).
exten=s,n,Return()

`````