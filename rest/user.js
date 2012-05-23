var User = require('../models/user').model,
    rest = [];

rest.push({
    type: 'post',
    url: '/user',
    callback: function(req,res) {
        User.find({'email':req.body.email}, function(err,users) {
            if(!users.length) {
                var user = new User({
                    email: req.body.email,
                    password: req.body.password,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    position: req.body.position
                });
                user.save();
                req.session.user = user;
                res.send(user);
            } else {
                res.send('');
            }
        });
    }
})

rest.push({
    type: 'get',
    url: '/user',
    callback: function(req,res) {
        User.find(function(err,users) {
            res.send(JSON.stringify(users));
        })
    }
})

rest.push({
    type: 'post',
    url: '/user/login',
    callback: function(req,res) {
        var query = {'email':req.body.email,'password':req.body.password}
        console.log('check auth for ',query);
        User.findOne(query,function(err,user) {
            if(!err && user) {
                console.log('login successful for ',user.email);
                req.session.user = user;
                res.send(user);
            } else {
                console.log('access denied!');
                res.send('');
            }
        })
    }
})

rest.push({
    type:'post',
    url: '/user/logout',
    callback: function(req,res) {
        req.session.user = null;
        res.send('true');
    }
})

rest.push({
    type: 'get',
    url: '/user/session',
    callback: function(req,res) {
        if(req.session.user){
            res.header('Content-Type','application/json');
            res.send(req.session.user);
        } else {
            res.send({});
        }
    }
})

// // TODO implement
// app.post('/user/settings',function(req,res) {
    // res.send('true');
// })

exports.rest = rest;