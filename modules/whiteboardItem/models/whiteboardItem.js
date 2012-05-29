var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    
    schema = new mongoose.Schema({
        editing     : Boolean,
        orderIndex  : Number,
        x           : Number,
        y           : Number,
        creator     : ObjectId,
        whiteboard  : ObjectId,
        item        : {
            type    : String,
            object  : mongoose.Schema.Types.Mixed
        }
    }),
    model  = mongoose.model('WhiteboardItem', schema);

exports.schema = schema;
exports.model  = model;