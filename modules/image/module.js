var pubsub = require('./io');
var service = require('./rest');

exports.init = function() {

}

exports.rest = service.rest;
exports.io = pubsub.io;
exports.style    = 'css/main.css';