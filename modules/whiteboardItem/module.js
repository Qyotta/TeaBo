var service = require('./rest');
var pubsub = require('./io');

exports.init = function() {

}

exports.rest = service.rest;
exports.io = pubsub.io;
exports.style    = 'css/whiteboardItem.css';
