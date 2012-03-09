define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone, whiteboardTemplate){
    
    var WhiteboardView = Backbone.View.extend({
        el: $("#page"),
        events:{
            //'click .mainPanel input[type=submit]' : 'submitClicked',
        },
        initialize:function(){
		
		}
	});
	
	return WhiteboardView;
});