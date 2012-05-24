var Whiteboard = require('./models/whiteboard').model;
var Assignment = require('./../../modules/assignment/models/assignment').model;

var getAllAssignments = function(req,res){
    console.log("all assignments");
    console.log(req.session.user);
    //Assignment.find({},function(err,users) {
    //    res.send(JSON.stringify(users));
    //})
}
exports.rest = [
    { url: '/whiteboard',         type: 'get',   callback: getAllAssignments},
];