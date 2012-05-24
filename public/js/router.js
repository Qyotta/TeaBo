define([
    'jquery',
    'underscore',
    'backbone',
    '/core/js/views/register.js',
    '/core/js/views/main.js',
    '/core/js/views/login.js',
    '/core/js/views/dialogs/logout.js',
    '/core/js/views/colorchooser/colorchooser.js'
], function($, _, Backbone, RegisterView,MainHomeView,LoginView,LogoutDialogView,ColorChooserDialogView){
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
            window.app.eventDispatcher.trigger("whiteboard:overview");
            /*window.app.modules.whiteboard.sync();*/ // TODO move to whiteboard controller!
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