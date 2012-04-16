define([
    'jquery',
    'underscore',
    'backbone',
    'modules/note/collection_note',
    'modules/note/view_note',
    'modules/note/model_note'
], function($, _, Backbone, NoteCollection,NoteView,Note){
    
    var NoteController = function(options){
        _.bindAll(this,'getNotes','createNote','noteCreated','subscribeChannels','_handleMovedWhiteboardItem','_handleDeletedWhiteboardItem','_handleEditedNote', 'deleteNote');
        window.app.eventDispatcher.bind("note:create",this.createNote);
        window.app.eventDispatcher.bind("whiteboard:opened",this.getNotes);
        window.app.eventDispatcher.bind('handshakeComplete',this.subscribeChannels);
        window.app.eventDispatcher.bind('note:delete',this.deleteNote);
        
        this.initialize();
    };
    
    NoteController.prototype = {
        initialize: function() {
			this.views = [];
        },
        subscribeChannels:function(){
            window.app.subscribeChannel('/whiteboardItem/move/'+this.whiteboard.id,this._handleMovedWhiteboardItem);
            window.app.subscribeChannel('/whiteboardItem/delete/'+this.whiteboard.id,this._handleDeletedWhiteboardItem);
			window.app.subscribeChannel('/note/edited/'+this.whiteboard.id,this._handleEditedNote);
            window.app.subscribeChannel('/note/posted/'+this.whiteboard.id, this.noteCreated);
        },
        getNotes:function(whiteboard){
            this.whiteboard = whiteboard;
            this.noteCollection = new NoteCollection(null,{id:this.whiteboard.id});
            
            var self = this;
            this.noteCollection.fetch({
                success:function(collection, response){
                    collection.each(function(_note) {
                        self.views[_note.id] = new NoteView({ model:_note, whiteboardId: self.whiteboard.id});
                    });
                    self.subscribeChannels();
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
            var _note = new Note({
                    creator : message.data.creator,
                    x       : message.data.x,
                    y       : message.data.y
            });
            _note.id = message.data.id;
            this.noteCollection.add(_note);
            window.app.log("whiteboard id "+this.whiteboard.id);
            this.views[_note.id] = new NoteView({ model: _note, whiteboardId: this.whiteboard.id });
            window.app.log(this.views);
        },
        _handleMovedWhiteboardItem:function(message) {
            var _id 	= message.data.id;
            var _x 		= message.data.x;
            var _y 		= message.data.y;
            
            var _note 	= this.noteCollection.get(_id);
            _note.set({"x":_x,"y":_y});

            window.app.log("note moved("+_id+",x:"+_x+",y:"+_y+")");
        },
        _handleDeletedWhiteboardItem:function(message){
        	var _id = message.data.id;
        	var _note = this.noteCollection.get(_id);
        	if(_note){
        		this.noteCollection.remove(_note);
        		this.views[_note.id].remove();
        	}
        },
		_handleEditedNote:function(message){
			var _id 	= message.data.id;
			var _text 	= message.data.text;

            var _note 	= this.noteCollection.get(_id);
            _note.set({text:_text});
		},
        deleteNote:function(model) {
        	window.app.publish( '/service/whiteboardItem/delete', {
        		id : model.id,
                whiteboardid : this.whiteboard.id
            });
        }
    };
    
    return NoteController;
});
