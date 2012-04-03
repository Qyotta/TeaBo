define([
    'jquery',
    'underscore',
    'backbone',
	'collections/note',
	'views/note/note'
], function($, _, Backbone, NoteCollection,NoteView){
    
    var NoteController = function(options){
    	_.bindAll(this,'getNotes','createNote');
        window.app.eventDispatcher.bind("note:create",this.createNote);
        window.app.eventDispatcher.bind("whiteboard:opened",this.getNotes);
    };
    
    NoteController.prototype = {
    	getNotes:function(whiteboard){
			var notes = new NoteCollection(null,{id:whiteboard.id});
			notes.fetch({success:function(collection, response){collection.each(function(note){
				new NoteView({model:note,whiteboardid:notes.id});
			});}});
		},
		createNote:function(){
			alert('create note');
		}
    };
    
    return NoteController;
});