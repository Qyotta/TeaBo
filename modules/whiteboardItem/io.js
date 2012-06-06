var WhiteboardItem = require('../../modules/whiteboardItem/models/whiteboardItem').model,
    User           = require('../../modules/user/models/user').model,
    io             = [];

io['/service/whiteboardItem/post'] = function(bayeux,channel,obj) {
    User.findOne(obj.creator.id, function(err,user) {
        var whiteboardItem = new WhiteboardItem({
            editing     : false,
            orderIndex  : 0, // TODO change this to the current number of items
            x           : obj.x,
            y           : obj.y,
            creator     : user._id,
            whiteboard  : obj.whiteboardid,
            type        : obj.type 
        })
        
        whiteboardItem.save();
        console.log('note saved!');
        
        var id = whiteboardItem._id;
        obj.creator.password = null;
        bayeux.getClient().publish('/whiteboardItem/posted/'+obj.whiteboardid, 
                { x : obj.x,
                  y : obj.y,
                  _id: id,
                  creator : obj.creator,
                  editing     : false,
                  orderIndex  : 0, // TODO change this to the current number of items
                  type        : obj.type
                });
    })
}

io['/service/whiteboardItem/delete'] = function(bayeux,channel,obj) {
    WhiteboardItem.findOne({_id:obj.id}, function(err,whiteboardItem) {
        whiteboardItem.remove();
        bayeux.getClient().publish('/whiteboardItem/delete/'+obj.whiteboardid, { id: obj.id });
    })
}

io['/service/whiteboardItem/move'] = function(bayeux,channel,obj) {
    WhiteboardItem.findOne({_id:obj.id}, function(err,whiteboardItem) {
        whiteboardItem.x = obj.x;
        whiteboardItem.y = obj.y;
        
        whiteboardItem.save();
        bayeux.getClient().publish('/whiteboardItem/move/'+obj.whiteboardid, 
                { x : obj.x, y : obj.y, id: obj.id });
    })
}

exports.io = io;