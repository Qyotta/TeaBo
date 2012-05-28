var User = require('./models/user').model;

var register = function(req,res) {
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

var getUser = function(req,res) {
    User.find(function(err,users) {
        res.send(JSON.stringify(users));
    })
}

var postLogin = function(req,res) {
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

var postLogout = function(req,res) {
    req.session.user = null;
    res.send('true');
}

var getSession = function(req,res) {
    if(req.session.user){
        res.header('Content-Type','application/json');
        res.send(req.session.user);
    } else {
        res.send({});
    }
}

exports.rest = [
    { url: '/user',         type: 'post',   callback: register},
    { url: '/user/login',   type: 'post',   callback: postLogin},
    { url: '/user/logout',  type: 'post',   callback: postLogout },
    { url: '/user/session', type: 'get',    callback: getSession},
    { url: '/user',         type: 'get',    callback: getUser},
];