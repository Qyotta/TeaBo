var WhiteboardItem = require('../../modules/whiteboardItem/models/whiteboardItem').model,
    Note           = require('../../modules/note/models/note').model,
    User           = require('../../modules/user/models/user').model,
    io             = [];

io['/service/note/post'] = function(bayeux,channel,obj) {

}

exports.io = io;