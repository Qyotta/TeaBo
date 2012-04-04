define([
    'jquery',
    'underscore',
    'backbone',
    'views/dialogs/dialog',
    'text!templates/dialogs/inviteUser.html',
    'views/notice/notice',
    'views/notice/error',
], function($, _, Backbone, Dialog, inviteUserDialogTemplate, Notice, Error){
    var whiteboardId=0;
    var isActive = false;
    var InviteUserDialogView = Dialog.extend({
        el:$('#dialogs'),
        initialize:function(){  
            _.bindAll(this,'showInviteUserDialog', 'inviteUser');
            window.app.eventDispatcher.bind("whiteboard:opened",this.setWhiteboardId);
            window.app.eventDispatcher.bind("inviteClicked",this.showInviteUserDialog);
            //this.render();
        },
        events:{
            'click #inviteUserContainer button.cancel' : 'hideInviteUserDialog',
            'click #inviteUserContainer input[type=submit]': 'inviteUser'
        },
        render: function(){
            var compiledTemplate = _.template( inviteUserDialogTemplate );
            this.el.html(compiledTemplate);
        },
        setWhiteboardId:function(whiteboard){
            alert(whiteboard.id);
            whiteboardId = whiteboard.id;
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

            if(whiteboardId < 1){
                alert("Whiteboard:opened - Trigger didn't work");
                return false;
            }
            var self = this;
            $.ajax({
                url: 'whiteboard/invite',
                type: 'post',
                contentType: 'application/json',
                data: '{"email":"'+$('input[name=address]').val()+'", "whiteboardId":'+whiteboardId+'}',
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
