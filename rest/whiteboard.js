var User            = require('../models/user').model,
    Assignment      = require('../models/assignment').model,
    Whiteboard      = require('../models/whiteboard').model,
    mongoose        = require('mongoose'),
    QueryObjectId   = mongoose.Types.ObjectId,
    rest            = [];

rest.push({
    type: 'get',
    url: '/whiteboard',
    callback: function(req,res) {
        if(req.session.user) {
            Assignment.find({'user._id':req.session.user._id},function(err,assignedWhiteboards) {
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
            })
        } else {
            res.send('');
        }
    }
})

rest.push({
    type: 'post',
    url: '/whiteboard',
    callback: function(req,res) {
        var whiteboard = new Whiteboard({
            name: req.body.name,
            x: 0,
            y: 0
        });
        whiteboard.save(function(err) {
            User.findById(req.session.user._id, function(err,user) {
                var assignment = new Assignment({
                    color      : [100,100,100],
                    user       : [user],
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
    }
})

rest.push({
    type: 'delete',
    url: '/whiteboard/:id',
    callback: function(req,res) {
        Whiteboard.findById(req.params.id, function(err, whiteboard) {
            if(whiteboard) {
                Assignment.find({'whiteboard._id':new QueryObjectId(req.params.id)},function(err,assignments) {
                    for(var i = 0; i < assignments.length; ++i) {
                        assignments[i].remove();
                        console.log('whiteboard and assignments removed');
                    }
                    whiteboard.remove();
                })
            }
        });
        return res.send('');
    }
})

// app.get('/whiteboard/:id',function(req,res) {
    // res.send(req.params.id);
// })

exports.rest = rest;