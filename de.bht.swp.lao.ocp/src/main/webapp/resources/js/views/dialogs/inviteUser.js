define([
    'jquery',
    'underscore',
    'backbone',
    'views/dialogs/dialog',
    'text!templates/dialogs/inviteUser.html',
    'views/notice/notice'
], function($, _, Backbone, Dialog, inviteUserDialogTemplate, Notice){
    var whiteboardId=0;
    var InviteUserDialogView = Dialog.extend({
        initialize:function(){
            _.bindAll(this,'showInviteUserDialog');
            window.app.eventDispatcher.bind("whiteboard:open",this.setWhiteboardId);
            window.app.eventDispatcher.bind("inviteClicked",this.showInviteUserDialog);
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
        setWhiteboardId:function(whiteboard){
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
            var self = this;
            $.ajax({
                url: 'whiteboard/invite',
                type: 'post',
                contentType: 'application/json',
                data: '{"email":"'+$('input[name=address]').val()+'", "whiteboardId":'+whiteboardId+'}',
                success: function(data){ 
                    self.hideDialog();
                    new Notice({message:"Invitation was sent"});
                },
                error: function(err){
                    window.app.log(err.statusText);
                }
            });
        }
    });    
    
    return InviteUserDialogView;
});
