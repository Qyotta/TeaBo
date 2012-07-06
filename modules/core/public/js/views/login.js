define([
    'jquery',
    'underscore',
    'backbone',
    'text!/core/templates/login.html',
    '/core/js/views/notice/error.js',
    '/core/js/views/dialogs/ForgotPasswordDialog.js'
], function($, _, Backbone, loginTemplate,Error,ForgotPasswordDialog){
    var LoginDialogView = Backbone.View.extend({
        initialize:function(){
            
        },
        events:{
            'click .loginContainer input[type=submit]' : 'loginBtnClicked',
            'click a[href=#forgotPassword]' : 'forgetLinkClicked',
        },
        render: function(){
            var compiledTemplate = _.template( loginTemplate );
            $(this.el).html(compiledTemplate);
            $('#page').html(this.el);
        },
        unrender: function(){
            $(this.el).remove();
        },
        forgetLinkClicked:function(evt){
            evt.preventDefault();
            console.log("forgetLinkClicked");
            new ForgotPasswordDialog().showDialog();
        },
        loginBtnClicked:function(evt){
            evt.preventDefault();
            var self = this;
            $.ajax({
                url: 'user/login',
                type: 'post',
                contentType: 'application/json',
                data: '{"email":"'+$('input[name=email]').val()+'","password":"'+$('input[name=password]').val()+'"}',
                success: function(data){ 
                    if(data !== '') {
                        window.app.user.set(data);
                        window.app.user.synced = true;
                        if(window.app.loggedIn()){
                            self.unrender();
                            window.app.eventDispatcher.trigger("whiteboard:sync");
                            window.router.navigate("main", {trigger: true});
                        }
                    } else {
                        new Error({message:'username or password was wrong, please try again!'});
                    }
                    
                },
                error: function(request, errorType, exception){
                    new Error({message:exception});
                }
            });
        }
    });
    
    return LoginDialogView;
});
