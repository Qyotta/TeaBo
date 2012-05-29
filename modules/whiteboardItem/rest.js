var Item = require('./models/whiteboardItem').model
    fs   = require('fs');

var getNotes = function(req,res) {
    var id   = req.params.id;
    
    Item.find({'whiteboard':id,'item.type':'notes'}, function(err,items) {
        res.send(items);
    })
}

var getAttachment = function(req,res) {
    var id   = req.params.id,
        type = req.params.type;
    
    Item.find({'whiteboard':id,'item.type':'attachment'}, function(err,items) {
        res.send(items);
    })
}

exports.rest = [
    { url: '/whiteboard/:id/notes',       type: 'get', callback: getNotes       },
    { url: '/whiteboard/:id/attachments', type: 'get', callback: getAttachment  },
];