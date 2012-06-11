var WhiteboardItem = require('../../modules/whiteboardItem/models/whiteboardItem').model,
    User           = require('../../modules/user/models/user').model,
    io             = [];

io['/service/note/edit'] = function(bayeux,channel,obj) {
    WhiteboardItem.findOne({_id:obj.id}, function(err,note) {
        note.content = note.content? note.content : {};
        note.content.text = obj.text;
        note.markModified('content');
        note.save();
        
        bayeux.getClient().publish('/note/edited/'+obj.whiteboardid, { id: obj.id, text: obj.text });
    })
}

exports.io = io;