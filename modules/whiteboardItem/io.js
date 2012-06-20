var WhiteboardItem = require('../../modules/whiteboardItem/models/whiteboardItem').model,
    User           = require('../../modules/user/models/user').model,
    io             = [];

io['/service/whiteboardItem/post'] = function(bayeux,channel,obj) {
    var maxOrder = 0;
    WhiteboardItem.findOne({whiteboard:obj.whiteboardid}).sort('orderIndex', -1).run(function(err,maxWhiteboardItem) {
        if(maxWhiteboardItem){
            maxOrder = maxWhiteboardItem.orderIndex;
        }
    });
    
    User.findOne({_id:obj.creator}, function(err,user) {
        if(user){
            maxOrder++;
            if(!obj.content) obj.content = {};
            var whiteboardItem = new WhiteboardItem({
                editing     : false,
                orderIndex  : maxOrder,
                x           : obj.x,
                y           : obj.y,
                creator     : user._id,
                whiteboard  : obj.whiteboardid,
                type        : obj.type, 
                content     : obj.content
            });
            
            whiteboardItem.save();
            console.log('Item saved!');
            
            var id = whiteboardItem._id;
            obj.creator.password = null;
            bayeux.getClient().publish('/whiteboardItem/posted/'+obj.whiteboardid, 
                    { x : obj.x,
                      y : obj.y,
                      _id: id,
                      creator : obj.creator,
                      editing     : false,
                      orderIndex  : maxOrder, 
                      type        : obj.type,
                      content     : obj.content
                    });
        }
    });
};

io['/service/whiteboardItem/delete'] = function(bayeux,channel,obj) {
    WhiteboardItem.findOne({_id:obj.id}, function(err,whiteboardItem) {
        whiteboardItem.remove();
        bayeux.getClient().publish('/whiteboardItem/delete/'+obj.whiteboardid, { id: obj.id });
    });
};

io['/service/whiteboardItem/move'] = function(bayeux,channel,obj) {
    WhiteboardItem.findOne({_id:obj.id}, function(err,whiteboardItem) {
        whiteboardItem.x = obj.x;
        whiteboardItem.y = obj.y;
        
        whiteboardItem.save();
        bayeux.getClient().publish('/whiteboardItem/move/'+obj.whiteboardid, 
                { x : obj.x, y : obj.y, id: obj.id });
    });
};

io['/service/whiteboardItem/order'] = function(bayeux,channel,obj) {
    var maxOrder = 0;
    WhiteboardItem.findOne({whiteboard:obj.whiteboardid}).sort('orderIndex', -1).run(function(err,maxWhiteboardItem) {
        if(maxWhiteboardItem){
            maxOrder = maxWhiteboardItem.orderIndex;
        }
    });
    WhiteboardItem.findOne({_id:obj.id}, function(err,whiteboardItem) {
        maxOrder++;
        if(whiteboardItem){
            whiteboardItem.orderIndex = maxOrder;
            
            whiteboardItem.save();
            bayeux.getClient().publish('/whiteboardItem/changeOrder/'+obj.whiteboardid, 
                    { id: obj.id, order : maxOrder });
        }
    });
};

exports.io = io;