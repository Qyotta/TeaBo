var User    = require('./models/user').model,
    mailer  = require('../../utils/laoMailer'),
    fs      = require('fs'),
    bcrypt  = require('bcrypt'),
    configs = JSON.parse(fs.readFileSync('package.json', 'utf8'));

var register = function(req,res) {
    var username = req.body.firstname.length && req.body.lastname.length ? ' ' + req.body.firstname + ' ' + req.body.lastname : '';

    User.find({'email':req.body.email}, function(err,users) {
        if(!users.length) {
            var genSalt = bcrypt.genSaltSync(); //generate different salt per user
            var user = new User({
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, genSalt),
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                position: req.body.position,
                salt: genSalt
            });

            user.save(function(err) {
                mailer.send({
                    receiver: req.body.email,
                    subject : 'Welcome to [lao]!',
                    text: '<body style="font-size:12px; font-family:Helvetiva, sans serif;">'+
                          '<h1 style="margin-bottom:10px;">Hello'+username+'</h1><br>'+
                          'we are glad to welcome you to our <a href="'+configs.server.express.host+':'+configs.server.express.port+'">[lao]</a> project. Your registration was successful!<br>'+
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

            req.session.user = getUserDTO(user);
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

var getUserDTO = function(user){
    return {
        _id         : user._id,
        email       : user.email,
        firstname   : user.firstname,
        lastname    : user.lastname,
        position    : user.position,
        settings    : user.settings
    };
}

var postLogin = function(req,res) {
    var query = {'email':req.body.email};
    User.findOne(query,function(err,user) {
        if(!err && user) {
            var curPW = bcrypt.hashSync(req.body.password, user.salt);
            if(user.password === curPW){
                req.session.user = getUserDTO(user);
                res.send(req.session.user);
            }
            else {
                res.send('');
            }
        } else {
            res.send('');
        }
    });
};

var postLogout = function(req,res) {
    req.session.user = null;
    res.send('true');
};

var checkPassword = function(req, res){
    User.findOne({'_id':req.session.user._id},function(err,user) {
        if(user.password === bcrypt.hashSync(req.body.password, user.salt)){
            res.send(true);
        } 
        else{
            res.send(false)
        }
    });
}

var getSession = function(req,res) {
    if(req.session.user){
        res.header('Content-Type','application/json');
        res.send(req.session.user);
    } else {
        res.send({});
    }
};

var changePreferences = function(req,res){
    User.findOne({'_id':req.body._id},function(err,user) {
        if(req.body.password){
            user.password = bcrypt.hashSync(req.body.password, user.salt);
        }
		user.email = req.body.email;
        user.firstname = req.body.firstname;
        user.lastname = req.body.lastname;
        user.position = req.body.position;
        user.save(function(err) {
            res.send({success:true});
        });
        req.session.user = getUserDTO(user);
    });
};

// util functions
function generatePassword() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz!§$%&/()=?+*#-_<>";
    var string_length = 10;
    var randomstring = '';
    for (var i=0; i<string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
}

var forgotPassword = function(req,res){
    var email = req.body.email;
    
    User.findOne({'email':email},function(err,user) {
        if(!err && user) {
            var username = user.firstname.length && user.lastname.length ? ' ' + user.firstname + ' ' + user.lastname : '';
            
            var genSalt = bcrypt.genSaltSync();
            var genPassword = generatePassword();
            user.password = bcrypt.hashSync(genPassword, genSalt);
            user.salt = genSalt;
            user.save(function(err){
                if(!err){
                    mailer.send({
                        receiver: email,
                        subject : 'New credentials to [lao]!',
                        text: '<body style="font-size:12px; font-family:Helvetiva, sans serif;">'+
                              '<h1 style="margin-bottom:10px;">Hello'+username+'</h1><br>'+
                              'you forgot your password for the <a href="'+configs.server.express.host+':'+configs.server.express.port+'">[lao]</a> plattform.<br>'+
                              'Here are your login credentials:<br><br>'+
                              '<table>'+
                              '<tr><td><b>Email:</b></td><td>'  + email  + '</td></tr>'+
                              '<tr><td><b>Password:</b></td><td>'  + genPassword  + '</td></tr>'+
                              '</table><br><br>'+
                              'With Regards,<br>' +
                              '<h2>[l]ook [a]head [o]nline</h2>'+
                              '</body>'
                    });
                }
            });

            res.send({success:true,message:"An email with your credentials was send."});
        }else{
            res.send({success:false,message:"User wasn't found. "})
        }
    });
}

exports.rest = [
    { url: '/user',                     type: 'post',   callback: register},
    { url: '/user/login',               type: 'post',   callback: postLogin},
    { url: '/user/logout',              type: 'post',   callback: postLogout },
    { url: '/user/session',             type: 'get',    callback: getSession},
    { url: '/user',                     type: 'get',    callback: getUser},
    { url: '/user',                     type: 'put',    callback: changePreferences},
    { url: '/user/validatePassword',    type: 'post',   callback: checkPassword},
    { url: '/user/forgotPassword',      type: 'post',   callback: forgotPassword}
];
