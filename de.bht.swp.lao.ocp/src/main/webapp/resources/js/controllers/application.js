define([
    'jquery',
    'underscore',
    'backbone',
    '../app',
    'models/user', 
    'views/home/topbar'
], function($, _, Backbone,App,User, TopbarView){
    
    var ApplicationController = function(options){
        
        this.initialize();
    };
    
    ApplicationController.prototype = {
        initialize:function(){
            this.createApplication();
            window.app.eventDispatcher.trigger("application:started");
        },
        createApplication:function(){
            var userData = window.userData || {};
            
            window.app = new App({
                debug : true,
                user : new User(userData)
            });
            
            this.topbarView = new TopbarView();
        }
    };
    
    return ApplicationController;
});