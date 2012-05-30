var Note           = require('./models/note').model,
    WhiteboardItem = require('../../modules/whiteboardItem/models/whiteboardItem').model,
    Note           = require('../../modules/note/models/note').model,
    User           = require('../../modules/user/models/user').model,
    io             = [];

io['/note/post'] = function(bayeux,channel,obj) {
    var note = new Note({
        text: ''
    })

    User.findOne({'email':obj.creator}, function(err,user) {
        var whiteboardItem = new WhiteboardItem({
            editing     : false,
            orderIndex  : 0, // TODO change this to te current number of items
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
        
        var sendObject = {
            id: whiteboardItem._id,
            x: whiteboardItem.x,
            y: whiteboardItem.y,
            creator: obj.creator
        }
        var id = whiteboardItem._id;
        bayeux.getClient().publish('/note/posted/'+obj.whiteboardid, {
            creator: obj.creator,
            x: obj.x,
            y: obj.y,
            id: id
        });
    })
}

exports.io = io;