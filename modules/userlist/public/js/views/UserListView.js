define([
    'jquery',
    'underscore',
    'backbone',
    '/userlist/js/views/UserListRow.js'
], function($, _, Backbone, UserListRow){
    
    var UserListView = Backbone.View.extend({
        tagName: "ul",
        initialize:function(){
            _.bindAll(this,'addUser');
            this.views = [];
        },
        render:function(){
            this.model.each(this.addUser);
            return this;
        },
        addUser:function(assignment){
            if(!assignment)return;
            if(this.views[assignment.id])return;
            var view = new UserListRow({model: assignment});
            $(this.el).append(view.render().el);
            this.views[assignment.id] = view;
        }
    });
    
    return UserListView;
});