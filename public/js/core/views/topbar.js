define([
    'jquery',
    'underscore',
    'backbone',
    'core/views/notice/notice',
    'core/views/notice/error',
    'text!templates/home/topbar.html',
    'core/views/AssignmentListView'
], function($, _, Backbone, Notice, Error, topbarTemplate,AssignmentListView){
    
    var TopbarView = Backbone.View.extend({
        el: $("#topNavigation"),
        events:{
            'click .right a[href="logout"]' :'logoutClicked',
            'click .right a[href="invite"]' :'inviteClicked',
            'click .right a[href="main"]' :'mainClicked',
            'click .logo a[href="main"]' : 'mainClicked',
            'click div.invite' : 'preventDefault',
            'submit form#invite' : 'inviteUser',
        },
        initialize:function(){
            _(this).bindAll('changedUser','inviteUser');
            
            this.isInviteInProgress = false;
            
            window.app.user.bind("change", this.changedUser);
        },
        render: function(){
            var user  = window.app.user,
                title = null;
            
            if(this.whiteboard){
                var view = 'whiteboard';
                var color = this.whiteboard.getColorByUser(user.get('email'));
            }
            if(window.app.modules.whiteboard && window.app.modules.whiteboard.whiteboard) {
                title = window.app.modules.whiteboard.whiteboard.attributes.name;
            }
            
            var data = {user:user,title:title,view: view,versionNumber: window.app.versionNumber,versionType: window.app.versionType,color:color};
            
            var compiledTemplate = _.template( topbarTemplate, data );
            this.el.html(compiledTemplate);
            
            if(this.whiteboard){
                this.assignmentView = new AssignmentListView({model:this.whiteboard.get('assignments')});
                $('#whiteboard-users-container').html(this.assignmentView.render().el);
            }
        },
        changedUser:function(){
            this.render();
        },
        logoutClicked:function(e){
            e.preventDefault();
            window.app.eventDispatcher.trigger('logoutClicked', null);
        },
        inviteClicked:function(e){
            e.preventDefault();
            window.app.eventDispatcher.trigger('topbar:inviteClicked', null);
        },
        mainClicked:function(e) {
            e.preventDefault();
            window.app.eventDispatcher.trigger('whiteboard:close',null);
            window.router.navigate("main", {trigger: true});
        },
        inviteUser:function(e) {
            e.preventDefault();
            alert("invite");
            if(this.isInviteInProgress == true){
                return false;
            }
            this.isInviteInProgress = true;
            
            var self = this;
            $.ajax({
                url: 'whiteboard/invite',
                type: 'post',
                contentType: 'application/json',
                data: '{"email":"'+$('input[name=address]').val()+'", "whiteboardId":'+window.app.modules.whiteboard.whiteboard.attributes.id+'}',
                success: function(data){ 
                    new Notice({message:"Invitation was sent"});
                    self.isInviteInProgress = false;
                },
                error: function(err){
                    window.app.log(err.statusText);
                    self.isInviteInProgress = false;
                }
            });
        },
        preventDefault:function(e) {
            e.preventDefault();
        }
    });
    
    return TopbarView;
});