define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/note/note.html',
	'collections/note'
], function($, _, Backbone, noteTemplate,NoteCollection){
    
    var NotesView = Backbone.View.extend({
		initialize:function(){
            _.bindAll(this,'getNotes','createNote');
            window.app.eventDispatcher.bind("note:create",this.createNote);
            window.app.eventDispatcher.bind("whiteboard:view",this.getNotes);
		},
		events:{
            //'click .mainPanel input[type=submit]' : 'submitClicked',
        },
		getNotes:function(whiteboard){
			var notes = new NoteCollection(null,{id:whiteboard.id});
			notes.fetch({success:function(collection, response){collection.each(function(model){
				new NoteView({model:model});
			});}});
		},
		createNote:function(){
			alert('create note');
		}
    });
    
    return NotesView;
});