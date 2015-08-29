'use strict';

var Joi = require('joi');

var ConfigSchema = Joi.object().keys({    
    port: Joi.number().integer().min(1).max(65535).required(),
    asterisk: Joi.object().keys({                
        host: Joi.string().required(),
        port: Joi.number().integer().min(1).max(65535).required(),
        username: Joi.string().required(),
        password: Joi.string().required()
    }).required()    
});

module.exports = ConfigSchema;