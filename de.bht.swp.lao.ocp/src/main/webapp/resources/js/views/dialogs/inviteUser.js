define([
    'jquery',
    'underscore',
    'backbone',
    'views/dialogs/dialog',
    'text!templates/dialogs/inviteUser.html',
    'views/notice/notice',
    'views/notice/error',
], function($, _, Backbone, Dialog, inviteUserDialogTemplate, Notice, Error){
    var isActive = false;
    var InviteUserDialogView = Dialog.extend({
        el:$('#dialogs'),
        initialize:function(options){  
            _.bindAll(this,'showInviteUserDialog', 'inviteUser');
            window.app.eventDispatcher.bind("topbar:inviteClicked",this.showInviteUserDialog);
            console.log(this.options.whiteboardId);
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
            
            console.log(this.options.whiteboardId);
            if(this.options.whiteboardId < 1){
                alert("Whiteboard:opened - Trigger didn't work");
                return false;
            }
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
