define([
    'jquery',
    'underscore',
    'backbone',
    'views/dialogs/dialog',
    'text!templates/dialogs/logout.html'
], function($, _, Backbone, Dialog, logoutDialogTemplate){
    var LogoutDialogView = Dialog.extend({
        initialize:function(){
            _.bindAll(this,'showLogoutDialog');
            window.app.eventDispatcher.bind("logoutClicked",this.showLogoutDialog);
            this.render();
        },
        events:{
            'click #logoutContainer button.cancel' : 'hideLogoutDialog',
            'click #logoutContainer input[type=submit]': 'logout'
        },
        render: function(){
            var compiledTemplate = _.template( logoutDialogTemplate );
            this.el.html(compiledTemplate);
        },
        showLogoutDialog:function(){
            window.app.log('showLogoutDialog');
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
                contentType: 'application/json',
                success: function(data){ 
                    window.app.logout();
                    if(!window.app.loggedIn()){
                        self.hideDialog();
                        window.app.router.navigate("login", {trigger: true});
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
