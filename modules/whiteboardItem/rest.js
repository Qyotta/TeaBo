var Item = require('./models/whiteboardItem').model
    fs   = require('fs');

var getNotes = function(req,res) {
    var id   = req.params.id;
    
    Item.find({'whiteboard':id,'item.class':'note'}, function(err,items) {
        var notes = [];
        for(var i = 0; i < items.length; ++i) {
            console.log(items[i].item.type);
        }
        res.send(items);
    })
}

var getAttachment = function(req,res) {
    var id   = req.params.id,
        type = req.params.type;
    
    Item.find({'whiteboard':id,'item.class':'attachment'}, function(err,items) {
        res.send(items);
    })
}

exports.rest = [
    { url: '/whiteboard/:id/notes',       type: 'get', callback: getNotes       },
    { url: '/whiteboard/:id/attachments', type: 'get', callback: getAttachment  },
];