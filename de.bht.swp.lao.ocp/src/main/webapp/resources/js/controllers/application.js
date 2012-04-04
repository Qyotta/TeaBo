define([
    'jquery',
    'underscore',
    'backbone',
    '../app',
    'models/user', 
    'views/home/topbar',
    'controllers/note'
], function($, _, Backbone,App,User, TopbarView, NoteController){
    
    var ApplicationController = function(options){
        
        this.initialize();
    };
    
    ApplicationController.prototype = {
        initialize:function(){
            this.createApplication();
            window.app.eventDispatcher.trigger("application:started");

            Backbone.history.start();
        },
        createApplication:function(){
            var userData = window.userData || {};
            
            window.app = new App({
                debug : true,
                user : new User(userData)
            });
            
            this.topbarView = new TopbarView();
            this.noteController = new NoteController();
        }
    };
    
    return ApplicationController;
});