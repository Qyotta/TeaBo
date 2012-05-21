var mongoose = require('mongoose'),

    schema   = new mongoose.Schema({
        key    : String,
        value  : String,
        userID : Number
    }),
    model    = mongoose.model('Settings',schema);
    
exports.schema = schema;
exports.model  = model;