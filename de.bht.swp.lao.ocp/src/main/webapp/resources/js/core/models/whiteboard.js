define([
    'underscore',
    'backbone',
    'core/collections/assignment'
], function(_, Backbone,AssignmentCollection) {
    var Whiteboard = Backbone.Model.extend({
        defaults: {
            name: null,
            x:0,
            y:0,
            assignments: new AssignmentCollection()
        },
        parse: function(response) {
            response.assignments = new AssignmentCollection(response.assignments);
            return response;
        },
        set: function(attributes, options) {
            if (attributes.assignments !== undefined && !(attributes.assignments instanceof AssignmentCollection)) {
                attributes.assignments = new AssignmentCollection(attributes.assignments);
            }
            return Backbone.Model.prototype.set.call(this, attributes, options);
        },
        toJSON : function(){
          return {name: this.get("name")};
        },
        getAssignmentByUser:function(user){
            var assignments = this.get('assignments');
            if(!assignments)return;
            return assignments.filter(function(a){
                return a.get('user').get('email') == user;
            })[0];
        },
        getColorByUser:function(user){
            var assignments = this.get('assignments');
            if(!assignments)return;
            var assignment = assignments.filter(function(a){
                return a.get('user').get('email') == user;
            })[0];
            
            if(assignment){
                var color = assignment.get('color');
                return "rgb("+100*color[0]+"%,"+100*color[1]+"%,"+100*color[2]+"%)";
            }
            return null;
        }
    });
    
    return Whiteboard;
});
