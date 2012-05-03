define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    var Whiteboard = Backbone.Model.extend({
        defaults: {
            name: null,
            x:0,
            y:0
        },
        toJSON : function(){
    	  return {name: this.get("name")};
    	},
    	getColorByUser:function(user){
    	    var assignments = this.get('assignments');
    	    if(!assignments)return;
    	    for(var i=0;i<assignments.length;i++){
    	        var assignment = assignments[i];
    	        if(assignment.user==user){
    	            var color = assignment.color;
    	            return "rgb("+100*color[0]+"%,"+100*color[1]+"%,"+100*color[2]+"%)";
    	        }
    	    }
    	    return null;
    	}
    });
    
    return Whiteboard;
});
