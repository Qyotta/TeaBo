define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){
    
    var User = Backbone.Model.extend({
		name: 'user'
	});
	return User;
});