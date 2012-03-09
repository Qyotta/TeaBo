// Filename: app.js
define([
    'jquery',
    'underscore',
    'backbone',
    'router',
	'views/home/topbar'
], function($, _, Backbone,AppRouter,TopbarView){		
	var App = function(options) {
		this.user = options.user;
		this.options = options || {};
		this.el = $('body');
		this.previous_state = '#';
		_.bindAll(this, 'log','loggedIn');
	};

	App.prototype = {
		init:function(){
			this.topbarView = new TopbarView();
			this.eventDispatcher = _.extend({}, Backbone.Events);
			this.router = new AppRouter();
			Backbone.history.start();
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
		}
	};
	
	return App;
});
