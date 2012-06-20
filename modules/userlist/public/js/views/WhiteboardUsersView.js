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
            'submit form#invite' : 'inviteUser',
            'focus .mailaddress' : 'freezeUserlist',
            'blur .mailaddress' : 'freezeUserlist',
            'click a[href="/userlist/invite"]' : 'inviteUser'
        },
        preventDefault:function(e) {
            e.preventDefault();
        },
        inviteUser:function(e) {
            e.preventDefault();

            var input  = $(this.el).find('input.mailaddress'),
                button = $(this.el).find('img.inviteButton');

            if(this.isInviteInProgress === true){
                return false;
            }

            this.isInviteInProgress = true;
            button.css('display','none');
            
            var self = this;
            $.ajax({
                url: '/assignment/invite',
                type: 'post',
                contentType: 'application/json',
                data: '{"email":"'+input.val()+'", "whiteboardId":"'+window.app.modules.whiteboard.whiteboard.get('_id')+'"}',
                success: function(data){

                    if(data.res.type === 'error'){
                        new Error({message:data.res.message});

                    }else{
                        new Notice({message:data.res.message});
                        window.app.eventDispatcher.trigger('assignment:created',data.assignment);
                    }
                    
                    self.isInviteInProgress = false;
                    input.val("");
                    button.removeAttr('style');
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
        },
        freezeUserlist: function(e) {
            if(e.type === 'focusin') {
                $(this.el).find('>div').css('display','block');
            } else {
                $(this.el).find('>div').removeAttr('style');
            }
        }
    });
    
    return WhiteboardUsersView;
});