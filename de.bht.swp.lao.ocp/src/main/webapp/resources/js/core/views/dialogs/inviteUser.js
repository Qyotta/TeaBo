define([
    'jquery',
    'underscore',
    'backbone',
    'core/views/dialogs/dialog',
    'core/views/notice/notice',
    'core/views/notice/error',
    'text!templates/dialogs/inviteUser.html',
], function($, _, Backbone, Dialog, Notice, Error, inviteUserDialogTemplate){
    var isActive = false;
    var InviteUserDialogView = Dialog.extend({
        el:$('#dialogs'),
        initialize:function(options){  
            _.bindAll(this,'showInviteUserDialog', 'inviteUser');
            window.app.eventDispatcher.bind("topbar:inviteClicked",this.showInviteUserDialog);
            this.render();
        },
        events:{
            'click #inviteUserContainer button.cancel' : 'hideInviteUserDialog',
            'click #inviteUserContainer input[type=submit]': 'inviteUser'
        },
        render: function(){
            var compiledTemplate = _.template( inviteUserDialogTemplate );
            this.el.html(compiledTemplate);
        },
        showInviteUserDialog:function(){
            this.showDialog();
        },
        hideInviteUserDialog:function(evt){
            evt.preventDefault();
            this.hideDialog();
        },
        inviteUser:function(evt){
            
            evt.preventDefault();
            if(isActive == true){
                return false;
            }
            isActive = true;
            
            var self = this;
            $.ajax({
                url: 'whiteboard/invite',
                type: 'post',
                contentType: 'application/json',
                data: '{"email":"'+$('input[name=address]').val()+'", "whiteboardId":'+this.options.whiteboardId+'}',
                success: function(data){ 
                    self.hideDialog();
                    new Notice({message:"Invitation was sent"});
                    isActive = false;
                },
                error: function(err){
                    window.app.log(err.statusText);
                    isActive = false;
                }
            });
        }
    });
    
    return InviteUserDialogView;
});
