var WhiteboardItem = require('../../modules/whiteboardItem/models/whiteboardItem').model,
    User           = require('../../modules/user/models/user').model,
    io             = [];

io['/service/attachment/edit'] = function(bayeux,channel,obj) {
    WhiteboardItem.findOne({_id:obj.id}, function(err,file) {
        file.content = file.content? file.content : {};
        file.content.shortDescription = obj.shortDescription;
        file.markModified('content');
        file.save();
        
        bayeux.getClient().publish('/attachment/edited/'+obj.whiteboardid, { id: obj.id, shortDescription: obj.shortDescription });
    })
}

exports.io = io;