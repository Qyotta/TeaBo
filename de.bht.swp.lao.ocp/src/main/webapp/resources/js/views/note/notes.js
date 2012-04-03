define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/note/note.html',
	'collections/note',
	'views/note/note'
], function($, _, Backbone, noteTemplate,NoteCollection,NoteView){
    
    var NotesView = Backbone.View.extend({
        el: $("#whiteboard"),
		initialize:function(){
            _.bindAll(this,'getNotes','createNote');
            window.app.eventDispatcher.bind("note:create",this.createNote);
            window.app.eventDispatcher.bind("whiteboard:opened",this.getNotes);
		},
		getNotes:function(whiteboard){
			var notes = new NoteCollection(null,{id:whiteboard.id});
			notes.fetch({success:function(collection, response){collection.each(function(note){
				new NoteView({model:note,whiteboardid:notes.id});
			});}});
		},
		createNote:function(){
			alert('create note');
		}
    });
    
    return NotesView;
});