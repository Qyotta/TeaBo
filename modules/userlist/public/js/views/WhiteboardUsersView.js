define([
    'jquery',
    'underscore',
    'backbone',
    'text!/userlist/templates/whiteboardusers.html',
    '/core/js/views/notice/notice.js',
    '/core/js/views/notice/error.js'
], function($, _, Backbone, whiteboardusersTemplate, Notice, Error){
    
    var WhiteboardUsersView = Backbone.View.extend({
        className: 'invite',
        events: {
            'click a' : 'preventDefault',
            'submit form#invite' : 'inviteUser'
        },
        preventDefault:function(e) {
            e.preventDefault();
        },
        inviteUser:function(e) {
            e.preventDefault();

            var input = $(this.el).find('input.mailaddress');

            if(this.isInviteInProgress === true){
                return false;
            }

            this.isInviteInProgress = true;
            
            var self = this;
            $.ajax({
                url: '/assignment/invite',
                type: 'post',
                contentType: 'application/json',
                data: '{"email":"'+input.val()+'", "whiteboardId":"'+window.app.modules.whiteboard.whiteboard.get('_id')+'"}',
                success: function(data){
                    new Notice({ message: input.val()+" was invited." });
                    window.app.eventDispatcher.trigger('assignment:created',data);                 
                    self.isInviteInProgress = false;
                    input.val("");
                },
                error: function(err){
                    new Notice({ message: err.statusText });
                    window.app.log(err.statusText);
                    self.isInviteInProgress = false;
                }
            });
        },
        // gets called after assignments are synced - see controller
        render:function(){
            this.el.innerHTML    = whiteboardusersTemplate;
            this.delegateEvents();
        },
        // removes all html stuff, clears assignment list - gets called when whiteboard is closed
        unrender:function() {
            this.el.innerHTML = '';
        },

        setUserListView : function(userListView){
            $("'#whiteboard-users-container'",$(this.el)).html(userListView.render().el);
        }
    });
    
    return WhiteboardUsersView;
});