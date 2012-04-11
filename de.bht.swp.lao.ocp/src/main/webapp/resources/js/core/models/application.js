define([
    'underscore',
    'backbone',
    'core/router/router',
    'core/models/user',
    'cometd', 
    'jquerycometd'
], function( _, Backbone, Router, User, cometd, jquerycometd){
    
    var Application = function() {
        this.debugMode = true,
        this.user = {},
        this.modules = {},
        this.eventDispatcher = {},
        this.cometd = $.cometd;
        
        this.initialize();
    }
    
    Application.prototype = {
        initialize: function(options) {
            console.log('---- App started -----');
            
            this.eventDispatcher = _.extend({}, Backbone.Events);
            
            if(window.userData) {
                this.user = new User(window.userData);
            } else {
                this.user = new User();
            }
        },
        log : function(str) {
            if (this.debugMode) {
                console.log(str);
            }
        },
        loggedIn : function() {
            return !this.user.isNew();
        },
        
        loadModules: function(modules) {
            var m = [];
            for(var module in modules) {
                m[module] = new modules[module];
            }
            this.modules = m;
        }
    };
    
    return Application;

});