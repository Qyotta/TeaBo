var User            = require('../modules/user/models/user').model,
    Assignment      = require('../modules/assignment/models/assignment').model,
    Whiteboard      = require('../modules/whiteboard/models/whiteboard').model,
    Settings        = require('../modules/settings/models/settings').model,
    rest            = [];

rest.push({
    type: 'get',
    url: '/see/assignments',
    callback: function(req,res) {
        Assignment.find({},function(err,users) {
            res.send(JSON.stringify(users));
        })
    }
})

rest.push({
    type: 'get',
    url: '/see/whiteboard',
    callback: function(req,res) {
        Whiteboard.find(function(err,users) {
            res.send(JSON.stringify(users));
        })
    }
})

rest.push({
    type: 'get',
    url: '/see/user',
    callback: function(req,res) {
        User.find(function(err,users) {
            res.send(JSON.stringify(users));
        })
    }
})

rest.push({
    type: 'get',
    url: '/see/settings',
    callback: function(req,res) {
        Settings.find(function(err,users) {
            res.send(JSON.stringify(users));
        })
    }
})

rest.push({
    type: 'get',
    url: '/whiteboards/remove',
    callback: function(req,res) {
        Whiteboard.find({}, function(err,user) {
            for(var i = 0; i < user.length; ++i) {
                user[i].remove();
            }
            res.send('All whiteboards removed!');
        })
    }
})

rest.push({
    type: 'get',
    url: '/assignments/remove',
    callback: function(req,res) {
        Assignment.find({}, function(err,user) {
            for(var i = 0; i < user.length; ++i) {
                user[i].remove();
            }
            res.send('All Assignments removed!');
        })
    }
})

rest.push({
    type: 'get',
    url: '/user/remove',
    callback: function(req,res) {
        User.find({}, function(err,user) {
            for(var i = 0; i < user.length; ++i) {
                user[i].remove();
            }
            res.send('All users removed!');
        })
    }
})

rest.push({
    type: 'get',
    url: '/clearDB',
    callback: function(req,res) {
        Whiteboard.find({}, function(err,user) {
            for(var i = 0; i < user.length; ++i) {
                user[i].remove();
            }
        })
        Assignment.find({}, function(err,user) {
            for(var i = 0; i < user.length; ++i) {
                user[i].remove();
            }
        })
        User.find({}, function(err,user) {
            for(var i = 0; i < user.length; ++i) {
                user[i].remove();
            }
        })
        
        var user = new User({
            email:'max-mustermann@gmail.com',
            password:'testtest'
        });
        user.save();
    
        res.send('DB cleared!');
        
    }
})

exports.rest = rest;
