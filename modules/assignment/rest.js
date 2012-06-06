var Assignments   = require('../../modules/assignment/models/assignment').model,
	mongoose      = require('mongoose'),
    QueryObjectId = mongoose.Types.ObjectId;

var getAssignments = function(req,res) {
    var id = new QueryObjectId(req.params.id);

    Assignments.find({'whiteboard._id':id},function(err,assignments) {
        if(!err) {
            res.send(assignments);
        }
    });
};

exports.rest = [
   { url: '/whiteboard/:id/assignments', type: 'get', callback: getAssignments}
];