var mongoose       = require('mongoose'),
    SettingsSchema = require('../../settings/models/settings').schema,
    
    schema = new mongoose.Schema({
        email       : String,
        password    : String,
        salt        : String,
        firstname   : String,
        lastname    : String,
        position    : String,
        settings    : [SettingsSchema]
    }),
    model  = mongoose.model('User', schema);

exports.schema = schema;
exports.model  = model;