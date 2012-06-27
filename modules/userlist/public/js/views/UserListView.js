define([
    'jquery',
    'underscore',
    'backbone',
    '/userlist/js/views/UserListRow.js'
], function($, _, Backbone, UserListRow){
    
    var UserListView = Backbone.View.extend({
        tagName: "ul",
        initialize:function(){
            _.bindAll(this,'addUser','assignmentsChanged','render');
            
            var self = this;
            this.model.each(function(assignment){
                assignment.bind("change", function(){ self.assignmentsChanged(); });
            });

            this.model.bind('add',this.assignmentsChanged);
            this.model.bind('reset',this.render);//called when collection sorted

            this.views = [];
        },
        render:function(){
            this.model.each(this.addUser);
            return this;
        },
        assignmentsChanged:function(){
            $(this.el).empty();
            this.views = [];
            this.model.sort();
        },
        addUser:function(assignment){

            if(!assignment || this.views[assignment.id]) {
                return;
            }
            
            var view = new UserListRow({model: assignment});

            if(view.model.get('user').id == window.app.user.id){
                $(this.el).prepend(view.render().el);
            } else {
                $(this.el).append(view.render().el);
            }

            this.views[assignment.id] = view;
        }
    });
    
    return UserListView;
});