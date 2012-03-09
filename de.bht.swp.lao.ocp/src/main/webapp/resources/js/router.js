define([
    'jquery',
    'underscore',
    'backbone',
	'collections/whiteboard',
    'views/home/main',
	'views/dialogs/login',
    'views/dialogs/logout',
], function($, _, Backbone,WhiteboardCollection, MainHomeView,LoginDialogView,LogoutDialogView){
    var AppRouter = Backbone.Router.extend({
		initialize: function(){
			
		},
		routes: {
            // Define some URL routes
            'whiteboard/:id': 'showWhiteboard',
			'login':'login',
			'main':'showMainPanel',
            // Default
            '*actions': 'defaultAction'
        },
        showWhiteboard: function(id){
            alert(id);
        },
        login: function(){
            if(!window.app.loggedIn()){
				if(!window.app.loginView){
					window.app.loginView = new LoginDialogView();
				}else{
					window.app.loginView.render();
				}
				window.app.loginView.showDialog();		
			}
			else{
				this.navigate("main", {trigger: true});
			}
        },
		showMainPanel: function(){
			if(!window.app.loggedIn()){
				this.navigate("login", {trigger: true});
			}
			
			if(!window.app.logoutDialogView){
				window.app.logoutDialogView = new LogoutDialogView();
			}
			
			if(!window.app.createdWhiteboards){
				window.app.createdWhiteboards = new WhiteboardCollection();
				window.app.createdWhiteboards.url = config.contextPath+"/whiteboard/created";
			}
			
			if(!window.app.assignedWhiteboards){
				window.app.assignedWhiteboards = new WhiteboardCollection();
				window.app.assignedWhiteboards.url = config.contextPath+"/whiteboard/assigned";
			}
			
			var mainHomeView = new MainHomeView();
			
			window.app.createdWhiteboards.fetch({success: function(){
				window.app.assignedWhiteboards.fetch({success: function(){
					mainHomeView.render();
				}});
			}});
			
		},
        defaultAction: function(actions){
            if(!window.app.loggedIn()){
				this.navigate("login", {trigger: true});
			}else{
				this.navigate("main", {trigger: true});
			}
        }
    });
    
    return AppRouter;
});