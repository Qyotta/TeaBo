var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    
    schema = new mongoose.Schema({
        text:   String
    }),
    model  = mongoose.model('Note', schema);

exports.schema = schema;
exports.model  = model;