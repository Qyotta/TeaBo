define([
    'jquery',
    'underscore',
    'backbone',
    '/userlist/js/views/UserListRow.js',
    'text!/userlist/templates/userlist.html'
], function($, _, Backbone, UserListRow, UserListTemplate){
    
    var UserListView = Backbone.View.extend({
        tagName: "div",
        initialize:function(){
            _.bindAll(this,'addUser');
            this.views    = [];
            this.userlist = $('<ul />');

            $(this.el).addClass('invite');
            this.render();
        },
        render:function(){
            var data = {};
            var compiledTemplate = _.template( UserListTemplate, data );
            this.el.innerHTML=compiledTemplate;
        },
        addUser:function(assignments){
            var that = this;
            assignments.each(function(assignment) {
                console.log('haha');
                var currentWhiteboardID    = window.app.modules.whiteboard.whiteboard.get('_id'),
                    assignmentWhiteboardID = assignment.get('whiteboard')[0]._id;

                if(!assignment || that.views[assignment.id] || currentWhiteboardID !== assignmentWhiteboardID) {
                    return;
                }
                
                var view = new UserListRow({model: assignment});
                $(that.userlist).append(view.render().el);
                that.views[assignment.id] = view;
                console.log('fertig');
            });
            $(this.el).find('#whiteboard-users-container').append(this.userlist);
        }
    });
    
    return UserListView;
});