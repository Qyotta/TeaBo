define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/register.html',
], function($, _, Backbone,registerTemplate){
	var RegisterView = Backbone.View.extend({
        el: $("#page"),
        events:{
            'click .registerCancelButtons input[type=submit]' : 'submitClicked',
            'click .registerCancelButtons button' : 'cancelClicked',
        },
        initialize:function(){
			this.render();
		},
		render:function(){
			var data = {};
			var compiledTemplate = _.template( registerTemplate );
            this.el.html(compiledTemplate);
		},
		submitClicked:function(evt){
			evt.preventDefault();
			window.app.log('register submit');
		},
		cancelClicked:function(evt){
			evt.preventDefault();
			window.app.router.navigate("main", {trigger: true});
		},
	});
	
	return RegisterView;
});
