var Assignment = require('../../modules/assignment/models/assignment').model,
    io             = {};

io['/service/assignment/changeOnlineStatus'] = function(bayeux,channel,obj) {
    Assignment.findOne({_id:obj.assignmentId}, function(err,foundAssignment) {
        foundAssignment.onWhiteboard = obj.value;
        foundAssignment.save();
        bayeux.getClient().publish('/assignment/change/onlineStatus/'+foundAssignment.whiteboard[0]._id, { id:foundAssignment._id, onWhiteboard:foundAssignment.onWhiteboard});
    })
}

exports.io = io;