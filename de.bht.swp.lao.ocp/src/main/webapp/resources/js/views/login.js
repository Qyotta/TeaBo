define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/login.html',
    'views/notice/error',
], function($, _, Backbone, loginTemplate,Error){
    var LoginDialogView = Backbone.View.extend({
        el:$('#page'),
        initialize:function(){
            this.render();
        },
        events:{
            'click .loginContainer input[type=submit]' : 'loginBtnClicked',
        },
        render: function(){
            var compiledTemplate = _.template( loginTemplate );
            this.el.html(compiledTemplate);
        },
        loginBtnClicked:function(evt){
            evt.preventDefault();
            
            $.ajax({
                url: 'user/login',
                type: 'post',
                contentType: 'application/json',
                data: '{"email":"'+$('input[name=email]').val()+'","password":"'+$('input[name=password]').val()+'"}',
                success: function(data){ 
                    window.app.user.set(data);
                    if(window.app.loggedIn()){
                        window.app.router.navigate("main", {trigger: true});
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
