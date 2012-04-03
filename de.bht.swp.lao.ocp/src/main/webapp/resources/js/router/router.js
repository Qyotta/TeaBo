define([
    'jquery',
    'underscore',
    'backbone',
    'views/register',
    'views/home/main',
    'views/login',
<<<<<<< HEAD
    'views/dialogs/logout'
], function($, _, Backbone,RegisterView,MainHomeView,LoginView,LogoutDialogView){
=======
    'views/dialogs/logout',
    'views/dialogs/inviteUser',
	'views/whiteboard/whiteboard',
	'collections/note',
	'views/note/notes',
	'views/home/toolbar'
], function($, _, Backbone,WhiteboardCollection,RegisterView,MainHomeView,LoginView,LogoutDialogView,InviteUserDialogView,WhiteboardView,NoteCollection,NotesView,ToolbarView){
>>>>>>> 1e32dcf499215bc968bbde93f8eb0f9afd823745
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
        	window.app.eventDispatcher.trigger("whiteboard:open", id);
			new InviteUserDialogView();
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
            
            var mainHomeView = new MainHomeView();
            window.app.eventDispatcher.trigger("mainpanel:show");
            window.app.log("mainpanel:show");
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