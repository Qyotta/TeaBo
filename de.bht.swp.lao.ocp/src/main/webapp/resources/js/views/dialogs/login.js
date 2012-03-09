define([
    'jquery',
    'underscore',
    'backbone',
	'views/dialogs/dialog',
    'text!templates/dialogs/login.html'
], function($, _, Backbone, Dialog,loginDialogTemplate){
    var LoginDialogView = Dialog.extend({
        initialize:function(){
			window.app.log('initialize login dialog');
			this.render();
		},
		events:{
			'click .loginContainer input[type=submit]' : 'loginBtnClicked',
        },
		clicked:function(e){
			e.preventDefault();
			alert('click');
		},
        render: function(){
            var compiledTemplate = _.template( loginDialogTemplate );
            this.el.html(compiledTemplate);
        },
		loginBtnClicked:function(evt){
			evt.preventDefault();
			window.app.log('login button clicked');
			self = this;
			$.ajax({url: 'user/login',type: 'post',contentType: 'application/json',data: '{"email":"'+$('input[name=email]').val()+'","password":"'+$('input[name=password]').val()+'"}',//$('form[name=login]',this.el).serialize(),
                success: function(data){ 
					window.app.user.set(data);
					if(window.app.loggedIn()){
						window.app.router.navigate("main", {trigger: true});
						self.hideDialog();
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
