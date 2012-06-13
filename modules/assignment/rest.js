var Assignments   = require('../../modules/assignment/models/assignment').model,
    User          = require('../../modules/user/models/user').model,
    Whiteboard    = require('../../modules/whiteboard/models/whiteboard').model,
    mongoose      = require('mongoose'),
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

    Assignments.find({'whiteboard._id':id},function(err,assignments) {
        if(!err) {
            res.send(assignments);
        }
    });
};

var inviteUser = function(req,res) {
    var email        = req.body.email,
        whiteboardId = QueryObjectId(req.body.whiteboardId);

    Assignments.find({'user.email':email,'whiteboard._id':whiteboardId}, function(err,assignments) {
        if(!err && assignments) {
            User.findOne({'email':email}, function(err,user) {
                if(!err && user) {
                    // assign existing user to whiteboard
                    Whiteboard.findById(whiteboardId, function(err, whiteboard) {
                        var assignment = new Assignments({
                            color:      [Math.floor(Math.random()*200),Math.floor(Math.random()*200),Math.floor(Math.random()*200)],
                            user:       user,
                            isOwner:    false,
                            whiteboard: whiteboard
                        });

                        assignment.save(function() {
                            res.send({type: 'notice', message: user.email+' was invited to this whiteboard!'});
                        });
                    });
                } else {
                    // create a new user and assign him to the whiteboard
                    var newUser = new User({
                        email: email,
                        password: generatePassword()
                    });

                    newUser.save(function() {
                        Whiteboard.findById(whiteboardId, function(err, whiteboard) {
                            var assignment = new Assignments({
                                color:      [Math.floor(Math.random()*200),Math.floor(Math.random()*200),Math.floor(Math.random()*200)],
                                user:       newUser,
                                isOwner:    false,
                                whiteboard: whiteboard
                            });

                            assignment.save(function() {
                                // TODO email schicken
                                res.send({type: 'notice', message: email+' was invited to this whiteboard!'});
                            });
                        });
                    });
                }
            });
        } else {
            res.send({'error': 'whiteboard not found'});
        }
    });
};

exports.rest = [
   { url: '/whiteboard/:id/assignments', type: 'get', callback: getAssignments },
   { url: '/assignment/invite', type: 'post', callback: inviteUser }
];