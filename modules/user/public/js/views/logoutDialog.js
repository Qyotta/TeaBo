define([
    'jquery',
    'underscore',
    'backbone',
    '/core/js/views/dialogs/dialog.js',
    'text!/user/templates/logoutDialog.html'
], function($, _, Backbone, Dialog, logoutDialogTemplate){
    var LogoutDialogView = Dialog.extend({
        initialize:function(){
            _.bindAll(this,'showLogoutDialog');
            window.app.eventDispatcher.bind("logoutClicked",this.showLogoutDialog);
            $(this.el).attr("id","logoutContainer");
        },
        events:{
            'click button' : 'hideLogoutDialog',
            'click input[type=submit]': 'logout'
        },
        render: function(){
            $('#dialogs').empty();
            this.delegateEvents();
            var compiledTemplate = _.template(logoutDialogTemplate);
            $(this.el).html(compiledTemplate);
            $('#dialogs').html(this.el);
        },
        showLogoutDialog:function(){
            this.showDialog();
        },
        hideLogoutDialog:function(evt){
            evt.preventDefault();
            this.hideDialog();
        },
        logout:function(evt){
            evt.preventDefault();
            var self = this;
            $.ajax({
                url: 'user/logout',
                type: 'post',
                success: function(data){
                    window.app.logout();
                    if(!window.app.loggedIn()){
                        self.hideDialog();
                        window.app.eventDispatcher.trigger('whiteboard:close', null);
                        window.app.eventDispatcher.trigger('logout', null);
                        window.router.navigate("login", {trigger: true});
                    }
                },
                error: function(err){
                    window.app.log(err.statusText);
                }
            });
        }
    });
    return LogoutDialogView;
});
