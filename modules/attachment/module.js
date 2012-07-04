var pubsub  = require('./io');
var service = require('./rest');

exports.rest = service.rest;
exports.io   = pubsub.io;