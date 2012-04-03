define([
    'jquery',
    'underscore',
    'backbone',
    'collections/whiteboard',
    'views/register',
    'views/home/main',
    'views/login',
    'views/dialogs/logout',
    'views/dialogs/inviteUser',
	'views/whiteboard/whiteboard',
	'collections/note',
	'views/note/notes',
	'views/home/toolbar'
], function($, _, Backbone,WhiteboardCollection,RegisterView,MainHomeView,LoginView,LogoutDialogView,InviteUserDialogView,WhiteboardView,NoteCollection,NotesView,ToolbarView){
    var AppRouter = Backbone.Router.extend({
        initialize: function(){
            
        },
        routes: {
            // Define some URL routes
            'register':'loadRegister',
            'whiteboard/:id': 'showWhiteboard',
            'login':'showLogin',
            'main':'showMainPanel',
            // Default
            '*actions': 'defaultAction'
        },
        loadRegister:function(){
            new RegisterView();
        },
        showWhiteboard: function(id){
			var whiteboard = window.app.whiteboards.get(id);
			window.app.whiteboardView = new WhiteboardView();
			new ToolbarView();
			new NotesView();
			new InviteUserDialogView();
			window.app.startCometd();
			window.app.eventDispatcher.trigger("whiteboard:view", whiteboard);
        },
        showLogin: function(){
            if(!window.app.loggedIn()){
                if(!window.app.loginView){
                    window.app.loginView = new LoginView();
                }else{
                    window.app.loginView.render();
                }    
            }
            else{
                this.navigate("main", {trigger: true});
            }
        },
        showMainPanel: function(){
            if(!window.app.loggedIn()){
                this.navigate("login", {trigger: true});
                return;
            }
            
            if(!window.app.logoutDialogView){
                window.app.logoutDialogView = new LogoutDialogView();
            }
            
            if(!window.app.whiteboards){
                window.app.whiteboards = new WhiteboardCollection();
            }
            
            var mainHomeView = new MainHomeView();
            
            window.app.whiteboards.fetch({success: function(){
                mainHomeView.render();
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