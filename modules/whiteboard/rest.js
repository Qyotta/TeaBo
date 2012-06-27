var User            = require('../../modules/user/models/user').model,
    Assignment      = require('../../modules/assignment/models/assignment').model,
    Whiteboard      = require('../../modules/whiteboard/models/whiteboard').model,
    mongoose        = require('mongoose'),
    QueryObjectId   = mongoose.Types.ObjectId;

var get = function(req,res) {
    if(req.session.user) {
        Assignment.find({'user':req.session.user._id},function(err,assignedWhiteboards) {
            var whiteboards = [];
            for(var i = 0; i < assignedWhiteboards.length; ++i) {
                whiteboards.push({
                    _id: assignedWhiteboards[i].whiteboard[0]._id,
                    name: assignedWhiteboards[i].whiteboard[0].name,
                    x: assignedWhiteboards[i].whiteboard[0].x,
                    y: assignedWhiteboards[i].whiteboard[0].y,
                    isOwner: assignedWhiteboards[i].isOwner
                });
            }
            res.header('Transfer-Encoding','chunked');
            res.header('Content-Type','application/json');
            res.send(whiteboards);
        });
    } else {
        res.send('');
    }
};

var create = function(req,res) {
    var whiteboard = new Whiteboard({
        name: req.body.name,
        x: 0,
        y: 0
    });
    whiteboard.save(function(err) {
        User.findById(req.session.user._id, function(err,foundUser) {
            var assignment = new Assignment({
                color      : [Math.floor(Math.random()*200),Math.floor(Math.random()*200),Math.floor(Math.random()*200)],
                user       : foundUser._id,
                isOwner    : true,
                whiteboard : [whiteboard]
            });
            assignment.save();
            res.send({
                _id:whiteboard._id,
                name:req.body.name,
                x: 0,
                y: 0,
                isOwner: true
            });
            console.log('whiteboard "'+req.body.name+'" created!');
        });
    });
};

var remove = function(req,res) {
    Whiteboard.findById(req.params.id, function(err, whiteboard) {
        if(whiteboard) {
            Assignment.find({'whiteboard._id':new QueryObjectId(req.params.id)},function(err,assignments) {
                for(var i = 0; i < assignments.length; ++i) {
                    assignments[i].remove();
                    console.log('whiteboard and assignments removed');
                }
                whiteboard.remove();
            });
        }
    });
    return res.send('');
};

exports.rest = [
    { url: '/whiteboard',     type: 'get',    callback: get },
    { url: '/whiteboard',     type: 'post',   callback: create },
    { url: '/whiteboard/:id', type: 'delete', callback: remove }
];