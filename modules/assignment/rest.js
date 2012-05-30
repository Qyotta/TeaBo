var Assignments = require('../../modules/assignment/models/assignment').model;

var getAssignments = function(req,res) {
    var id = req.body.id;
    
    Assignments.find({'whiteboard.id':id},function(err,assignments) {
        if(!err) {
            res.send(assignments)
        }
    })
}

exports.rest = [
   { url: '/whiteboard/:id/assignments', type: 'get', callback: getAssignments},
];