var mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.ObjectId,
    
    schema = new mongoose.Schema({
        filename     : String,
        description  : String,
        uploaded     : Number
    }),
    model  = mongoose.model('Attachment', schema);

exports.schema = schema;
exports.model  = model;