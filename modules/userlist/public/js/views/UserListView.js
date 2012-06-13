define([
    'jquery',
    'underscore',
    'backbone',
    '/userlist/js/views/UserListRow.js',
    'text!/userlist/templates/userlist.html',
    '/core/js/views/notice/notice.js',
    '/core/js/views/notice/error.js'
], function($, _, Backbone, UserListRow, UserListTemplate, Notice, Error){
    
    var UserListView = Backbone.View.extend({
        tagName: 'div',
        className: 'invite',
        events: {
            'click a' : 'preventDefault',
            'submit form#invite' : 'inviteUser'
        },
        initialize:function(){
            _.bindAll(this,'addUser','unrender','render');
            window.app.eventDispatcher.bind("whiteboard:closed",this.unrender);

            this.views    = [];
            this.userlist = $('<ul />');
        },
        // gets called after assignments are synced - see controller
        render:function(){
            var data = {};
            var compiledTemplate = _.template( UserListTemplate, data );
            this.el.innerHTML    = compiledTemplate;
            this.delegateEvents();
        },
        // removes all html stuff, clears assignment list - gets called when whiteboard is closed
        unrender:function() {
            this.el.innerHTML = '';
            this.views        = [];
            this.userlist     = $('<ul />');
        },
        addUser:function(assignments){
            var that = this;

            // render div conatiner at first
            this.render();

            // look through all assignments and add assigned user to the list
            assignments.each(function(assignment) {
                var currentWhiteboardID    = window.app.modules.whiteboard.whiteboard.get('_id'),
                    assignmentWhiteboardID = assignment.get('whiteboard')[0]._id;

                if(!assignment || that.views[assignment.id] || currentWhiteboardID !== assignmentWhiteboardID) {
                    return;
                }
                
                var view = new UserListRow({model: assignment});
                $(that.userlist).append(view.render().el);
                that.views[assignment.id] = view;
            });

            // append html
            $(this.el).find('#whiteboard-users-container').append(this.userlist);
        },
        preventDefault:function(e) {
            e.preventDefault();
        },
        inviteUser:function(e) {
            e.preventDefault();

            var inputValue = $(this.el).find('input.mailaddress').val();

            if(this.isInviteInProgress === true){
                return false;
            }

            this.isInviteInProgress = true;
            
            var self = this;
            $.ajax({
                url: '/assignment/invite',
                type: 'post',
                contentType: 'application/json',
                data: '{"email":"'+inputValue+'", "whiteboardId":"'+window.app.modules.whiteboard.whiteboard.get('_id')+'"}',
                success: function(data){
                    if(data.type === 'notice') {
                        new Notice({ message: data.message });
                    } else if(data.type === 'error') {
                        new Error({ message: data.message });
                    }
                    self.isInviteInProgress = false;
                },
                error: function(err){
                    window.app.log(err.statusText);
                    self.isInviteInProgress = false;
                }
            });
        }
    });
    
    return UserListView;
});