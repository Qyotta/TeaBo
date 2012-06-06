var WhiteboardItem = require('../../modules/whiteboardItem/models/whiteboardItem').model,
    io             = [];

io['/service/whiteboardItem/delete'] = function(bayeux,channel,obj) {
    
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