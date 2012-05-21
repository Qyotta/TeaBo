var mongoose         = require('mongoose'),
    UserSchema       = require('./user').schema,
    WhiteboardSchema = require('./whiteboard').schema,
    
    schema = new mongoose.Schema({
        color      : [Number],
        user       : [UserSchema],
        isOwner    : Boolean,
        whiteboard : [WhiteboardSchema]
    }),
    model  = mongoose.model('Assignment', schema);

exports.schema = schema;
exports.model  = model;