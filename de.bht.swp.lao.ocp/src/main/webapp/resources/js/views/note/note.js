define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/note/note.html',
], function($, _, Backbone, noteTemplate){
    
    var NoteView = Backbone.View.extend({
        el: $("#whiteboard"),
        events:{
            //'click .mainPanel input[type=submit]' : 'submitClicked',
        },
		render:function(){
			var data = { note:this.model, _: _ };
            var compiledTemplate = _.template( noteTemplate, data );
            this.el.html(compiledTemplate);
		}
    });
    
    return NoteView;
});