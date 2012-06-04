var WhiteboardItem = require('../../modules/whiteboardItem/models/whiteboardItem').model,
    io             = [];

io['/service/whiteboardItem/move'] = function(bayeux,channel,obj) {
    obj.id;
    obj.x;
    obj.y;
    obj.whiteboardid;
    
    WhiteboardItem.findOne(obj.id, function(err,whiteboardItem) {
        whiteboardItem.x = obj.x;
        whiteboardItem.y = obj.y;
        
        whiteboardItem.save();
        console.log('whiteboardItem saved!');
        
        var id = whiteboardItem._id;
        bayeux.getClient().publish('/whiteboardItem/move/'+obj.whiteboardid, 
                { x : obj.x,
                  y : obj.y,
                  id: id,
                });
    })
}

exports.io = io;