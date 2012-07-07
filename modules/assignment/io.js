var Assignment = require('../../modules/assignment/models/assignment').model,
    io         = {},
    pingTime   = [],
    lastPing   = [];

io['/service/assignment/changeOnlineStatus'] = function(bayeux,channel,obj) {
    Assignment.findOne({_id:obj.assignmentId}, function(err,foundAssignment) {
        foundAssignment.onWhiteboard = obj.value;
        foundAssignment.save();
        bayeux.getClient().publish('/assignment/change/onlineStatus/'+foundAssignment.whiteboard[0]._id, { id:foundAssignment._id, onWhiteboard:foundAssignment.onWhiteboard});
    });
};

io['/service/assignment/changeColor'] = function(bayeux,channel,obj) {
    Assignment.findOne({_id:obj.assignmentId}, function(err,foundAssignment) {
        foundAssignment.color = [obj.color_r,obj.color_g,obj.color_b];
        foundAssignment.save();
        bayeux.getClient().publish('/assignment/change/color/'+foundAssignment.whiteboard[0]._id,
            { id:foundAssignment._id, color_r:obj.color_r,color_g:obj.color_g,color_b:obj.color_b}
        );
    });
};

io['/service/assignment/ping'] = function(bayeux,channel,obj) {
    pingTime[obj.userId] = (new Date()).getTime();
    checkPing(pingTime[obj.userId], bayeux, obj.userId, obj.assignmentId);
};

var checkPing = function(ping, bayeux, userId, assignmentId) {
    setTimeout(function() {
        if(pingTime[userId] === ping) {
            Assignment.findOne({_id:assignmentId}, function(err,foundAssignment) {
                foundAssignment.onWhiteboard = false;
                foundAssignment.save();
                bayeux.getClient().publish('/assignment/change/onlineStatus/'+foundAssignment.whiteboard[0]._id, { id:foundAssignment._id, onWhiteboard:foundAssignment.onWhiteboard});
            });
        }
    },1500);
};

exports.io = io;