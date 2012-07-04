var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    
    schema = new mongoose.Schema({
        videoID:  String,
        provider: String
    }),
    model  = mongoose.model('Video', schema);

exports.schema = schema;
exports.model  = model;