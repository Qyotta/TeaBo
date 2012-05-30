define([
    'jquery',
    'underscore',
    'backbone',
    '/core/js/views/register.js',
    '/core/js/views/main.js',
    '/core/js/views/login.js',
    '/core/js/views/dialogs/logout.js'
], function($, _, Backbone, RegisterView,MainHomeView,LoginView,LogoutDialogView){
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
            // '*actions': 'defaultAction'
        },
        loadRegister:function(){
            new RegisterView();
        },
        showWhiteboard: function(id){
            window.app.eventDispatcher.trigger("whiteboard:open", id);
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
            this.showMainPanel();
        },
        showMainPanel: function(){
            if(!window.app.user.synced) {
                return;
            }
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
            
            window.app.eventDispatcher.trigger("mainpanel:show");
            window.app.eventDispatcher.trigger("topbar:refresh");
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