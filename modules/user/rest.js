var User   = require('./models/user').model,
    mailer = require('../../utils/laoMailer');

var register = function(req,res) {
    var username = req.body.firstname.length && req.body.lastname.length ? ' ' + req.body.firstname + ' ' + req.body.lastname : '';

    User.find({'email':req.body.email}, function(err,users) {
        if(!users.length) {
            var user = new User({
                email: req.body.email,
                password: req.body.password,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                position: req.body.position
            });

            user.save(function(err) {
                mailer.send({
                    receiver: req.body.email,
                    subject : 'Welcome to [lao]!',
                    text: '<body style="font-size:12px; font-family:Helvetiva, sans serif;">'+
                          '<h1 style="margin-bottom:10px;">Hello'+username+'</h1><br>'+
                          'we are glad to welcome you to our <a href="http://localhost:3000">[lao]</a> project. Your registration was successful!<br>'+
                          'Now you can create your first whiteboard and develop amazing ideas!<br>'+
                          'Have fun and enjoy this tool!<br><br>'+
                          'Here are your login credentials:<br><br>'+
                          '<table>'+
                          '<tr><td><b>Email:</b></td><td>'  + req.body.email  + '</td></tr>'+
                          '<tr><td><b>Password:</b></td><td>'  + req.body.password  + '</td></tr>'+
                          '</table><br><br>'+
                          'With Regards,<br>' +
                          '<h2>[l]ook [a]head [o]nline</h2>'+
                          '</body>'
                });
            });

            req.session.user = user;
            res.send(user);

        } else {
            res.send('');
        }
    });
};

var getUser = function(req,res) {
    User.find(function(err,users) {
        res.send(JSON.stringify(users));
    });
};

var postLogin = function(req,res) {
    var query = {'email':req.body.email,'password':req.body.password};
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
    });
};

var postLogout = function(req,res) {
    req.session.user = null;
    res.send('true');
};

var getSession = function(req,res) {
    if(req.session.user){
        res.header('Content-Type','application/json');
        res.send(req.session.user);
    } else {
        res.send({});
    }
};

exports.rest = [
    { url: '/user',         type: 'post',   callback: register},
    { url: '/user/login',   type: 'post',   callback: postLogin},
    { url: '/user/logout',  type: 'post',   callback: postLogout },
    { url: '/user/session', type: 'get',    callback: getSession},
    { url: '/user',         type: 'get',    callback: getUser}
];