define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/login.html'
], function($, _, Backbone, loginTemplate){
    var LoginDialogView = Backbone.View.extend({
        el:$('#page'),
		initialize:function(){
			this.render();
		},
		events:{
			'click .loginContainer input[type=submit]' : 'loginBtnClicked',
			//'click .loginContainer a' : 'hideDialog',
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
                error: function(err){
                    window.app.log(err.statusText);
                }
            });
		}
    });
    
    return LoginDialogView;
});
