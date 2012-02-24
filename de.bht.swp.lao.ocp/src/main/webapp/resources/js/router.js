define([
    'jquery',
    'underscore',
    'backbone',
    'views/home/main',
    'views/dialogs/logout',
], function($, _, Backbone, MainHomeView,LogoutDialogView){
    var AppRouter = Backbone.Router.extend({
        routes: {
            // Define some URL routes
            'whiteboard/:id': 'showWhiteboard',
            // Default
            '*actions': 'defaultAction'
        },
        showWhiteboard: function(){
            
        },
        defaultAction: function(actions){
            MainHomeView.initialize();
        }
    });

    var initialize = function(){
        var app_router = new AppRouter;
        Backbone.history.start();
        LogoutDialogView.initialize();
    };
    
    return {initialize: initialize};
});
