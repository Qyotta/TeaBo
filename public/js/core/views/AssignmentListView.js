define([
    'jquery',
    'underscore',
    'backbone',
    'core/views/AssignmentListRow'
], function($, _, Backbone, AssignmentListRow){
    
    var AssignmentListView = Backbone.View.extend({
        tagName: "ul",
        initialize:function(){
            _.bindAll(this,'addAssignment');
            this.views = [];
        },render:function(){
            this.model.each(this.addAssignment);
            return this;
        },
        addAssignment:function(assignment){
            if(!assignment)return;
            if(this.views[assignment.id])return;
            var view = new AssignmentListRow({model: assignment});
            $(this.el).append(view.render().el);
            this.views[assignment.id] = view;
        }
    });
    
    return AssignmentListView;
});