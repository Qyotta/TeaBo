var Item = require('./models/whiteboardItem').model
    fs   = require('fs');

var getItems = function(req,res) {
    Item.find({'whiteboard':req.params.id}, function(err,items) {res.send(items)})
}

exports.rest = [
    { url: '/whiteboard/:id/whiteboarditem', type: 'get', callback: getItems  },
];