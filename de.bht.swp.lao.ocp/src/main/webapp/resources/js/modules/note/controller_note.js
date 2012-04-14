define([
    'jquery',
    'underscore',
    'backbone',
    'modules/note/collection_note',
    'modules/note/view_note',
    'modules/note/model_note'
], function($, _, Backbone, NoteCollection,NoteView,Note){
    
    var NoteController = function(options){
        _.bindAll(this,'getNotes','createNote','noteCreated','subscribeChannels','_handleMovedWhiteboardItem','_handleEditedNote', 'deleteNote');
        window.app.eventDispatcher.bind("note:create",this.createNote);
        window.app.eventDispatcher.bind("whiteboard:opened",this.getNotes);
        window.app.eventDispatcher.bind('handshakeComplete',this.subscribeChannels);
        window.app.eventDispatcher.bind('note:delete',this.deleteNote);
        
        this.initialize();
    };
    
    NoteController.prototype = {
        initialize: function() {
			
        },
        subscribeChannels:function(){
            window.app.subscribeChannel('/whiteboardItem/move/'+this.whiteboard.id,this._handleMovedWhiteboardItem);
			window.app.subscribeChannel('/note/edited/'+this.whiteboard.id,this._handleEditedNote);
            window.app.subscribeChannel('/note/posted/'+this.whiteboard.id, this.noteCreated);
        },
        getNotes:function(whiteboard){
            this.whiteboard = whiteboard;
            this.noteCollection = new NoteCollection(null,{id:this.whiteboard.id});
            
            this.subscribeChannels();

            var self = this;
            this.noteCollection.fetch({
                success:function(collection, response){
                    collection.each(function(note) {
                        new NoteView({ model:note, whiteboardId: self.whiteboard.id});
                    });
                }
            });
        },
        createNote:function(){
            window.app.publish( '/service/note/post/', {
                x : 400,
                y : 400,
                creator : window.app.user.get('email'),
                whiteboardid : this.whiteboard.id
            });
        },
        noteCreated:function(message) {
            var note = new Note({
                    creator : message.data.creator,
                    x       : message.data.x,
                    y       : message.data.y,
                    id      : message.data.id
            });
            new NoteView({ model: note , whiteboardId: this.whiteboard.id });
        },
        _handleMovedWhiteboardItem:function(message) {
            var _id 	= message.data.id;
            var _x 		= message.data.x;
            var _y 		= message.data.y;

            var _note 	= this.noteCollection.get(_id);
            _note.set({x:_x,y:_y});
        },
		_handleEditedNote:function(message){
			var _id 	= message.data.id;
			var _text 	= message.data.text;

            var _note 	= this.noteCollection.get(_id);
            _note.set({text:_text});
			window.app.log("note edited {"+_id+","+_text+"}");
		},
        deleteNote:function(id) {
            var model = this.noteCollection.get(id);
            model.destroy();
        }
    };
    
    return NoteController;
});
