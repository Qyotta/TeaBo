define([
    'underscore',
    'backbone',
    'core/models/assignment'
], function(_, Backbone,Assignment) {
    var AssignmentCollection = Backbone.Collection.extend({
        model: Assignment,
        parse:function(response){
            console.log(response);
            return response;
        },
        getColorByUser:function(user){
            for(var i=0;i<this.length;i++){
                var assignment = this.filter(function(assignment) {
                    return assignment.get('user')==user;
                });
                var color = assignment.get('color');
                return "rgb("+100*color[0]+"%,"+100*color[1]+"%,"+100*color[2]+"%)";
            }
            return null;
        }
    });
    
    return AssignmentCollection;
});
