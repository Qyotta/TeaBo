define([
    'underscore',
    'backbone',
    'core/router/router',
    'core/models/user',
    'cometd', 
    'jquerycometd'
], function( _, Backbone, Router, User, cometd, jquerycometd){
    
    var Application = function() {

		_.bindAll(this,'onMetaConnect');
        this.debugMode = true,
        this.user = {},
        this.modules = {},
        this.eventDispatcher = {},
        this.cometd = $.cometd;
        
        this.initialize();
    };
    
    Application.prototype = {
        initialize: function(options) {
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
        logout : function() {
            this.createGuestUser();
        },
        createGuestUser : function() {
            this.user = new User();
        },
        reset : function() {
            // clear all areas
            $('#topNavigation').html('');
            $('#page').html('');
            $('#dialogs').html('');
            this.initialize();
        },
        loadModules: function(modules) {
            var m = [];
            for(var module in modules) {
                m[module] = new modules[module];
            }
            this.modules = m;
        },
        startCometd : function() {
            this.cometd.configure({
                url : "cometd",
                logLevel : 'info'
            });
            
            this.cometd.addListener('/meta/handshake', this.onMetaHandshake);
            this.cometd.addListener('/meta/connect', this.onMetaConnect);
            this.cometd.handshake();
        },
        subscribeChannel : function(channel, callback) {
            this.cometd.subscribe(channel, callback);
        },
        publish : function(channel, msg) {
            this.cometd.publish(channel, msg);
        },
        onMetaHandshake : function() {
            window.app.eventDispatcher.trigger('handshakeComplete', null);
        },
        onMetaConnect : function() {
            if (this.cometd.isDisconnected()) {
                this._connected = false;
                return;
            }
            
            this._connected = true;
            
            var self = this;
            $(window).unload(function() {
                self.stopCometd();
            });
        },
        stopCometd : function() {
            this.cometd.disconnect(true);
        }
    };
    
    return Application;

});
