var Settings = require('../models/settings').model,
    rest     = [];
    
rest.push({
    type: 'post',
    url: '/user/settings',
    callback: function(req,res) {
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
})

rest.push({
    type: 'get',
    url: '/user/settings',
    callback: function(req,res) {
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
})

exports.rest = rest;