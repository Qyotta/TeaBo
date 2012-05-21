var mongoose = require('mongoose'),
    
    schema = new mongoose.Schema({
        name        : String,
        x           : Number,
        y           : Number
    }),
    model  = mongoose.model('Whiteboard', schema);

exports.schema = schema;
exports.model  = model;