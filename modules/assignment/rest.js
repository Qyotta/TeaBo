var Assignments   = require('../assignment/models/assignment').model,
    User          = require('../user/models/user').model,
    Whiteboard    = require('../whiteboard/models/whiteboard').model,
    mongoose      = require('mongoose'),
    mailer        = require('../../utils/laoMailer'),
    fs            = require('fs'),
    bcrypt        = require('bcrypt'),
    configs       = JSON.parse(fs.readFileSync('package.json', 'utf8')),
    QueryObjectId = mongoose.Types.ObjectId;

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

var getAssignments = function(req,res) {
    var id = new QueryObjectId(req.params.id);

    Assignments.find({'whiteboard._id':id},function(err,foundAssignments) {
        var changedAssignments = foundAssignments.length;
        var assignments = [];
        if(!err) {
            for(var i=0;i<foundAssignments.length;i++){
                var assignment = foundAssignments[i];

                User.findOne({'_id':assignment.user},function(err,foundUser){
                    assignments.push({
                        _id : assignment._id,
                        user: foundUser,
                        isOwner: assignment.isOwner,
                        onWhiteboard: assignment.onWhiteboard,
                        whiteboard: assignment.whiteboard,
                        color: assignment.color
                    });
                    changedAssignments--;

                    if(changedAssignments==0){
                        res.send(assignments);
                    }
                });
            }
        }
    });
};

var inviteUser = function(req,res) {
    var email        = req.body.email,
        whiteboardId = QueryObjectId(req.body.whiteboardId),
        // matches <anystring>@<anystring>.<anystring>
        // the length of the last part gets unrelevant in near future because of the new TLD e.g. *.hamburg etc.
        regex        = /\S+@\S+\.\S+/;

    // validate mail adress
    if(!regex.test(email)) {
        res.send({
            res: {
                type: 'error',
                message: 'email adress is not valid'
            }
        });
        return false;
    }

    Assignments.find({'user.email':email,'whiteboard._id':whiteboardId}, function(err,assignments) {
        
        if(assignments.length > 0){
        
            res.send({
                res: {
                    type: 'error',
                    message: 'user already assigned'
                }
            });
            return false;
        
        } else if(!err) {
            User.findOne({'email':email}, function(err,foundUser) {
                if(!err && foundUser) {
                    // assign existing user to whiteboard
                    Whiteboard.findById(whiteboardId, function(err, whiteboard) {
                        var assignment = new Assignments({
                            color:      [Math.floor(Math.random()*200),Math.floor(Math.random()*200),Math.floor(Math.random()*200)],
                            user:       foundUser._id,
                            isOwner:    false,
                            whiteboard: whiteboard
                        });

                        assignment.save(function() {
                            res.send({color:assignment.color,user:foundUser,isOwner:assignment.isOwner,onWhiteboard:false});
                        });
                    });
                } else {
                    // create a new user and assign him to the whiteboard
                    var genSalt = bcrypt.genSaltSync(); //generate different salt per user
                    var genPassword = generatePassword();
                    var newUser = new User({
                        email: email,
                        password: bcrypt.hashSync(genPassword, genSalt),
                        salt: genSalt,
                    });

                    newUser.save(function() {
                        Whiteboard.findById(whiteboardId, function(err, whiteboard) {
                            var assignment = new Assignments({
                                color:      [Math.floor(Math.random()*200),Math.floor(Math.random()*200),Math.floor(Math.random()*200)],
                                user:       newUser._id,
                                isOwner:    false,
                                whiteboard: whiteboard
                            });

                            assignment.save(function() {
                                mailer.send({
                                    receiver: email,
                                    subject : "[lao] Invitation to Whiteboard "+whiteboard.name,
                                    text: '<body style="font-size:12px; font-family:Helvetiva, sans serif;">'+
                                          '<h1 style="margin-bottom:10px;">Hello</h1><br>'+
                                          'you were invited to <b>' + whiteboard.name + '</b> Whiteboard<br>'+
                                          'You may login at <a href="'+configs.server.express.host+':'+configs.server.express.port+'">Online Collaboration Platform</a>.<br><br>'+
                                          'User: ' + email + '<br>'+
                                          'Password: ' + genPassword + '<br><br>' +
                                          'With Regards,<br>' +
                                          '<h2>[l]ook [a]head [o]nline</h2>'+
                                          '</body>',
                                    callback: function(err, result){
                                        if(!err) {
                                            res.send({
                                                assignment: {
                                                    _id: assignment._id,
                                                    color: assignment.color,
                                                    user : newUser,
                                                    isOwner: assignment.isOwner,
                                                    onWhiteboard: false
                                                },
                                                res: {
                                                    type: 'notice',
                                                    message: email+' was invited to this whiteboard!'
                                                }
                                            });
                                        } else {
                                            res.send({
                                                res: {
                                                    type: 'error',
                                                    message: email+' was invited to this whiteboard but email wasn\'t send!'}
                                                }
                                            );
                                            return false;
                                        }
                                    }
                                });
                            });
                        });
                    });
                }
            });
        } else {
            res.send({
                res: {
                    type: 'error',
                    message: 'whiteboard not found'
                }
            });
            return false;
        }
    });
};

exports.rest = [
   { url: '/whiteboard/:id/assignments', type: 'get', callback: getAssignments },
   { url: '/assignment/invite', type: 'post', callback: inviteUser }
];