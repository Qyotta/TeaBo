// Filename: app.js
define([
    'jquery',
    'underscore',
    'backbone',
    'models/user',
    'router/router',
    'views/home/topbar'
], function($, _, Backbone,User,AppRouter,TopbarView){        
    var App = function(options) {
        this.user = options.user;
        this.options = options || {};
        this.el = $('body');
        this.previous_state = '#';
        _.bindAll(this, 'log','loggedIn');
    };

    App.prototype = {
        init:function(){
            this.eventDispatcher = _.extend({}, Backbone.Events);
            this.topbarView = new TopbarView();
            this.router = new AppRouter();
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
