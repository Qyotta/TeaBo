var mongoose         = require('mongoose'),
    UserSchema       = require('./../../../modules/user/models/user').schema,
    WhiteboardSchema = require('./../../../modules/whiteboard/models/whiteboard').schema,
    
    schema = new mongoose.Schema({
        color      : [Number],
        user       : [UserSchema],
        isOwner    : Boolean,
        whiteboard : [WhiteboardSchema],
        onWhiteboard: Boolean
    }),
    model  = mongoose.model('Assignment', schema);

exports.schema = schema;
exports.model  = model;