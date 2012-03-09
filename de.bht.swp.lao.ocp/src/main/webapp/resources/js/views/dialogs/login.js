define([
    'jquery',
    'underscore',
    'backbone',
	'views/dialogs/dialog',
    'text!templates/dialogs/login.html'
], function($, _, Backbone, Dialog,loginDialogTemplate){
    var LoginDialogView = Dialog.extend({
        initialize:function(){
			this.render();
		},
		events:{
			'click .loginContainer input[type=submit]' : 'loginBtnClicked',
        },
        render: function(){
            var compiledTemplate = _.template( loginDialogTemplate );
            this.el.html(compiledTemplate);
        },
		loginBtnClicked:function(evt){
			evt.preventDefault();
			this.hideDialog();
			
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
                error: function(err){
                    window.app.log(err.statusText);
                }
            });
		}
    });
    
    return LoginDialogView;
});
