var WhiteboardItem = require('../../modules/whiteboardItem/models/whiteboardItem').model,
    User           = require('../../modules/user/models/user').model,
    io             = [];


io['/service/attachment/edit'] = function(bayeux,channel,obj) {
    WhiteboardItem.findOne({_id:obj.id}, function(err,file) {
        if(err) console.log(err);
        if(!file.content) file.content = {};
        file.content.complete = obj.complete;
        file.markModified('content');
        file.save();
        console.log("send: /attachment/edited/"+obj.whiteboardid);
        bayeux.getClient().publish('/attachment/edited/'+obj.whiteboardid, { id: obj.id, complete:obj.complete, filename : file.content.filename, extension : file.content.extension });
    })
}

exports.io = io;