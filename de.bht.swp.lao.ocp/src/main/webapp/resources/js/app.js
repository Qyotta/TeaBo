// Filename: app.js
define([
    'jquery',
    'underscore',
    'backbone',
	'cometd',
	'jquerycometd',
    'models/user',
    'router/router',
    'views/home/topbar',
    'controllers/note'
], function($, _, Backbone,cometd,jquerycometd,User,AppRouter,TopbarView,NoteController){        
    var App = function(options) {
		this.cometd = $.cometd;
        this.user = options.user;
        this.options = options || {};
        this.el = $('body');
        this.previous_state = '#';
        _.bindAll(this, 'log','loggedIn');
		this._connected = false;
    };

    App.prototype = {
        init:function(){
            this.eventDispatcher = _.extend({}, Backbone.Events);
            this.router = new AppRouter();
            this.topbarView = new TopbarView();
            this.noteController = new NoteController();
        },
        log: function(str) {
            if(this.options.debug) console.log(str);
        },
        setPreviousState: function() {
            this.previous_state = document.location.hash;
        },
        gotoPreviousState: function() {
            document.location.hash = this.previous_state;
        },
        loggedIn: function() {
            return !this.user.isNew();
        },
        createGuestUser: function(){
            this.user = new User();
        },
        logout:function(){
			this.createGuestUser();
            this.reset();
        },
		startCometd:function(){
			this.cometd.configure({
				url : "cometd",
				logLevel : 'info'
			});
			
			this.cometd.addListener('/meta/handshake', this.onMetaHandshake);
			this.cometd.addListener('/meta/connect', this.onMetaConnect);
			this.cometd.handshake();
		},
		subscribeChannel:function(channel,callback){
			this.cometd.subscribe(channel,callback);
		},
		publish:function(channel,msg){
			this.cometd.publish(channel, msg);
		},
		onMetaHandshake:function(){
			window.app.eventDispatcher.trigger('handshakeComplete',null);
		},
		onMetaConnect:function(){
			if (cometd.isDisconnected()) {
				this._connected = false;
				return;
			}
			
			this._connected = true;
			
			var self = this;
			$(window).unload(function() {
				self.stopCometd();
			});
		},
		stopCometd:function(){
			this.cometd.disconnect(true);
		},
        reset:function(){
            //clear all areas
            $('#topNavigation').html('');
            $('#page').html('');
            $('#dialogs').html('');
            this.init();
        }
    };
    
    return App;
});
