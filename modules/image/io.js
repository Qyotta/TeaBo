var WhiteboardItem = require('../../modules/whiteboardItem/models/whiteboardItem').model,
    User           = require('../../modules/user/models/user').model,
    io             = [];

io['/service/image/edit'] = function(bayeux,channel,obj) {
    WhiteboardItem.findOne({_id:obj.id}, function(err,image) {
        image.content = image.content? image.content : {};
        image.content.text = obj.text;
        image.markModified('content');
        image.save();
        
        bayeux.getClient().publish('/image/edited/'+obj.whiteboardid, { id: obj.id, text: obj.text });
    })
}

exports.io = io;