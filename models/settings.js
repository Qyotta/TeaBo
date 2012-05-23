var mongoose = require('mongoose'),

    schema   = new mongoose.Schema({
        key    : String,
        value  : String
    }),
    model    = mongoose.model('Settings',schema);
    
exports.schema = schema;
exports.model  = model;