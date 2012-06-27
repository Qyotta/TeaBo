var mongoose         = require('mongoose'),
    WhiteboardSchema = require('./../../../modules/whiteboard/models/whiteboard').schema,
    ObjectId = mongoose.Schema.ObjectId,

    schema = new mongoose.Schema({
        color      : [Number],
        user       : ObjectId,
        isOwner    : Boolean,
        whiteboard : [WhiteboardSchema],
        onWhiteboard: Boolean
    }),
    model  = mongoose.model('Assignment', schema);

exports.schema = schema;
exports.model  = model;