define([
    'underscore',
    'backbone',
    '/user/js/model/user.js',
    // '/core/js/utils/group_command.js',
], function( _, Backbone, User) {//}, User, GroupCommand ){
        
    var Application = function() {
        _.bindAll(this,'onMetaConnect', 'setSettings','loggedIn');
        
        this.versionNumber = 0.2;
        this.versionType = 'beta';
        
        this.debugMode = true,
        this.user = {},
        this.modules = {},
        this.eventDispatcher = {},
        this.cometd = $.cometd;
        this.commands = [];
        // this.groupCommand = new GroupCommand();
        
        this.initialize();
    };
    
    Application.prototype = {
        initialize: function(options) {
            this.eventDispatcher = _.extend({}, Backbone.Events);
            this.eventDispatcher.bind('userSettings:synced',this.setSettings);
            
            // find session user
            this.user = new User();
            this.user.synced = false;
            var that = this;
            $.ajax({
                url: 'user/session',
                type: 'get',
                success: function(data){ 
                    that.user = that.user.set(data);
                    that.user.synced = true;
                    if(that.loggedIn()) {
                        if(Backbone.history.fragment === 'main') {
                            window.router.showMainPanel();
                        } else {
                            window.router.navigate('main', {trigger: true});
                        }
                    } else {
                        window.router.navigate('login', {trigger: true});
                    }
                }, error: function(err) {
                    console.error('[ERROR] - couldn\'t get user session data',err);
                }
            });
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
            return Object.keys(this.user).length && Object.keys(this.user.attributes).length;
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