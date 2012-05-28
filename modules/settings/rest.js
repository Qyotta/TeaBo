var Settings = require('../models/settings').model;
    
var set = function(req,res) {
    if(!req.session.user) {
        res.send('');
        return;
    }
    User.findById(req.session.user._id, function(err, user) {
        if(user) {
            var setting = new Settings({
                key: req.body.key,
                value: req.body.value
            })
            user.settings.push(setting);
            res.send('');
        }
    })
}

var get = function(req,res) {
    if(!req.session.user) {
        res.send('');
        return;
    }
    User.findById(req.session.user._id, function(err, user) {
        if(user) {
            res.send(user.settings);
        }
    })
}

exports.rest = [
    { url: '/user/settings', type: 'post', callback: set },
    { url: '/user/settings', type: 'get',  callback: get }
];