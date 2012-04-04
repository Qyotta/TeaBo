define([
    'jquery',
    'underscore',
    'backbone',
    'views/register',
    'views/home/main',
    'views/login',
    'views/dialogs/logout',
    'views/dialogs/inviteUser',
], function($, _, Backbone,RegisterView,MainHomeView,LoginView,LogoutDialogView,InviteUserDialogView){
    var AppRouter = Backbone.Router.extend({
        initialize: function(){
            window.app.eventDispatcher.bind('application:loggedIn',this.loggedIn);
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
                this.loginView = new LoginView();
                this.loginView.render();
            }
            else{
                this.navigate("main", {trigger: true});
            }
        },
        loggedIn: function() {
            window.whiteboardController.sync();
        },
        showMainPanel: function(){
            if(!window.app.loggedIn()){
                this.navigate("login", {trigger: true});
                return;
            }
            
            if(!window.app.logoutDialogView){
                window.app.logoutDialogView = new LogoutDialogView();
            }
            if(!this.mainHomeView) {
                this.mainHomeView = new MainHomeView();
            }
            this.mainHomeView.render();
            window.app.eventDispatcher.trigger("topbar:refresh");
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