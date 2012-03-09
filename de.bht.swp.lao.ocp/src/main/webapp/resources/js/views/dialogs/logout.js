define([
    'jquery',
    'underscore',
    'backbone',
	'views/dialogs/dialog',
    'text!templates/dialogs/logout.html'
], function($, _, Backbone, Dialog, logoutDialogTemplate){
    var LogoutDialogView = Dialog.extend({
        initialize:function(app){
			logoutDialogView.render();
			_(this).bindAll('showLogout');
			window.app.eventDispatcher.bind("logoutClicked",this.showLogout());
		},
		events:{
            'logoutClicked' : 'showLogoutDialog',
            'click #logoutContainer button.cancel' : 'hideLogoutDialog',
        },
        render: function(){
            var compiledTemplate = _.template( logoutDialogTemplate );
            this.el.html(compiledTemplate);
        },
        showLogoutDialog:function(){sss
			window.app.log('logoutClicked event trigger');
			this.render();
			this.showDialog();
        },
        hideLogoutDialog:function(evt){
            evt.preventDefault();
			this.hideDialog();
        }
    });    
    
    return LogoutDialogView;
});
