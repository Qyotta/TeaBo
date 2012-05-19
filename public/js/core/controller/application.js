define([
    'underscore',
    'backbone',
    'core/router/router',
    'core/models/user',
    'core/utils/group_command',
    'cometd', 
    'jquerycometd'
], function( _, Backbone, Router, User, GroupCommand, cometd, jquerycometd){
    
    var Application = function() {

        _.bindAll(this,'onMetaConnect', 'setSettings');
        
        this.versionNumber = 0.2;
        this.versionType = 'beta';
        
        this.debugMode = true,
        this.user = {},
        this.modules = {},
        this.eventDispatcher = {},
        this.cometd = $.cometd;
        this.commands = [];
        this.groupCommand = new GroupCommand();
        
        this.initialize();
    };
    
    Application.prototype = {
        initialize: function(options) {
            this.eventDispatcher = _.extend({}, Backbone.Events);
            this.eventDispatcher.bind('userSettings:synced',this.setSettings);
            
            if(window.userData) {
                this.user = new User(window.userData);
            } else {
                this.user = new User();
            }
            
        },
        setSettings : function(_settings){
          this.user.set({settings : _settings});
        },
        log : function(str) {
            if (this.debugMode) {
                console.log(str);
            }
        },
        loggedIn : function() {
            return Object.keys(window.app.user.attributes).length;
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
