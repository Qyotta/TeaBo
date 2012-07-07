define([
    'jquery',
    'underscore',
    'backbone',
    'text!/core/templates/login.html',
    '/core/js/views/notice/error.js'
], function($, _, Backbone, loginTemplate,Error,ForgotPasswordDialog){
    var LoginDialogView = Backbone.View.extend({
        events:{
            'click .loginContainer input[type=submit]' : 'loginBtnClicked'
        },
        render: function(){
            var compiledTemplate = _.template( loginTemplate );
            $(this.el).html(compiledTemplate);
            $('#page').html(this.el);
        },
        unrender: function(){
            $(this.el).remove();
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
