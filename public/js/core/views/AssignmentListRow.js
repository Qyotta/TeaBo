define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/assignment/assignment_row.html'
], function($, _, Backbone, assignmentRowTemplate){
    
    var AssignmentListRow = Backbone.View.extend({
        tagName: "li",
        events:{
            'click .assigned-user-color' : 'colorClicked'
        },
        initialize:function(){
            _.bindAll(this,'render');
            this.model.bind("change",this.render);
            this.render();
        },
        colorClicked : function(e){
            if(this.model.get('user').id != window.app.user.id)return;
            window.app.eventDispatcher.trigger('topbar:choose_color',this.model);
        },
        render:function(){
            var data = {
                user : this.model.get('user'),
                color: this.model.get('color')
            };
            var compiledTemplate = _.template( assignmentRowTemplate, data );
            this.el.innerHTML=compiledTemplate;
            return this;
        }
    });
    
    return AssignmentListRow;
});