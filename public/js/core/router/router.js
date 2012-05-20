define([
    'jquery',
    'underscore',
    'backbone',
    'core/views/register',
    'core/views/main',
    'core/views/login',
    'core/views/dialogs/logout',
    'core/views/colorchooser/colorchooser'
], function($, _, Backbone, RegisterView,MainHomeView,LoginView,LogoutDialogView,ColorChooserDialogView){
    var AppRouter = Backbone.Router.extend({
        initialize: function(){
            window.app.eventDispatcher.bind('application:loggedIn',this.loggedIn);
            window.app.log("app router loaded");
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
            if(!this.colorChooserDialogView) {
                this.colorChooserDialogView = new ColorChooserDialogView();
            }
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
            window.app.modules.whiteboard.sync();
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
            
            window.app.eventDispatcher.trigger("whiteboard:sync");
            
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