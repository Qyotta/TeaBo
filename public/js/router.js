define([
    'jquery',
    'underscore',
    'backbone',
    '/core/js/views/register.js',
    '/core/js/views/main.js',
    '/core/js/views/login.js'
], function($, _, Backbone, RegisterView,MainHomeView,LoginView){
    var AppRouter = Backbone.Router.extend({
        initialize: function(){
            window.app.eventDispatcher.bind('application:loggedIn',this.loggedIn);
        },
        routes: {
            // Define some URL routes
            'register':'loadRegister',
            'whiteboard/:id': 'showWhiteboard',
            'login':'showLogin',
            'main':'showMainPanel'
            // Default
            // '*actions': 'defaultAction'
        },
        loadRegister:function(){
            document.title = "[lao] look ahead online - register";
            new RegisterView();
        },
        showWhiteboard: function(id){
            document.title = "[lao] look ahead online - whiteboard view";
            window.app.eventDispatcher.trigger("whiteboard:open", id);
        },
        showLogin: function(){
            document.title = "[lao] look ahead online - login";
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

            document.title = "[lao] look ahead online - main view";
            
            if($('#whiteboard').length) {
                window.app.eventDispatcher.trigger("whiteboard:close",this.closedWhiteboard);
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