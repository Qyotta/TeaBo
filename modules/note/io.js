var Note           = require('./models/note').model,
    WhiteboardItem = require('../../modules/whiteboardItem/models/whiteboardItem').model,
    Note           = require('../../modules/note/models/note').model,
    User           = require('../../modules/user/models/user').model,
    io             = [];

io['/service/note/post'] = function(bayeux,channel,obj) {
    var note = new Note({
        text: ''
    })
    User.findOne(obj.creator.id, function(err,user) {
        var whiteboardItem = new WhiteboardItem({
            editing     : false,
            orderIndex  : 0, // TODO change this to the current number of items
            x           : obj.x,
            y           : obj.y,
            creator     : user._id,
            whiteboard  : obj.whiteboardid,
            item        : {
                class   : 'note',
                object  : note
            } 
        })
        
        whiteboardItem.save();
        console.log('note saved!');
        
        var id = whiteboardItem._id;
        obj.creator.password = null;
        bayeux.getClient().publish('/note/posted/'+obj.whiteboardid, 
                { x : obj.x,
                  y : obj.y,
                  _id: id,
                  creator : obj.creator,
                });
    })
}

exports.io = io;