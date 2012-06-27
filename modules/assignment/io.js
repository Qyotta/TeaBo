var Assignment = require('../../modules/assignment/models/assignment').model,
    io             = {};

io['/service/assignment/changeOnlineStatus'] = function(bayeux,channel,obj) {
    Assignment.findOne({_id:obj.assignmentId}, function(err,foundAssignment) {
        foundAssignment.onWhiteboard = obj.value;
        foundAssignment.save();
        bayeux.getClient().publish('/assignment/change/onlineStatus/'+foundAssignment.whiteboard[0]._id, { id:foundAssignment._id, onWhiteboard:foundAssignment.onWhiteboard});
    })
}

io['/service/assignment/changeColor'] = function(bayeux,channel,obj) {
    Assignment.findOne({_id:obj.assignmentId}, function(err,foundAssignment) {
        foundAssignment.color = [obj.color_r,obj.color_g,obj.color_b];
        foundAssignment.save();
        bayeux.getClient().publish('/assignment/change/color/'+foundAssignment.whiteboard[0]._id, 
            { id:foundAssignment._id, color_r:obj.color_r,color_g:obj.color_g,color_b:obj.color_b}
        );
    })
}

exports.io = io;