var Settings = require('./models/settings').model,
    User     = require('../../modules/user/models/user').model;
    
var set = function(req,res) {
    if(!req.session.user) {
        res.send('');
        return;
    }
    User.findById(req.session.user._id, function(err, user) {
        if(user) {
            if(!user.settings.length){
                var setting = new Settings({
                    key: req.body.key,
                    value: req.body.value
                });
                user.settings.push(setting);
            }
            else {
                for(var i = 0; i < user.settings.length;i++){
                    if(user.settings[i].key === req.body.key){
                        user.settings[i].value = req.body.value;
                    }
                }
            }
            
            user.save();
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
    { url: '/settings', type: 'post', callback: set },
    { url: '/settings', type: 'get',  callback: get }
];