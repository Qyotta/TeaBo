define([
    'jquery',
    'underscore',
    'backbone',
    'collections/whiteboard',
    'views/register',
    'views/home/main',
    'views/login',
    'views/dialogs/logout',
], function($, _, Backbone,WhiteboardCollection,RegisterView,MainHomeView,LoginView,LogoutDialogView){
    var AppRouter = Backbone.Router.extend({
        initialize: function(){
            
        },
        routes: {
            // Define some URL routes
            'register':'showRegister',
            'whiteboard/:id': 'showWhiteboard',
            'login':'showLogin',
            'main':'showMainPanel',
            // Default
            '*actions': 'defaultAction'
        },
        showRegister:function(){
            new RegisterView();
        },
        showWhiteboard: function(id){
            alert(id);
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