define([
    'jquery',
    'underscore',
    'backbone',
    'collections/note',
    'views/note/note',
    'models/note'
], function($, _, Backbone, NoteCollection,NoteView,Note){
    
    var NoteController = function(options){
        _.bindAll(this,'getNotes','createNote','noteCreated','subscribeChannels','_handleMovedWhiteboardItem');
        window.app.eventDispatcher.bind("note:create",this.createNote);
        window.app.eventDispatcher.bind("whiteboard:opened",this.getNotes);
        window.app.eventDispatcher.bind('handshakeComplete',this.subscribeChannels);
        
        this.initialize();
    };
    
    NoteController.prototype = {
        initialize: function() {
            window.app.log('Note loaded');
        },
        subscribeChannels:function(){
            window.app.subscribeChannel('/whiteboardItem/move/'+this.id,this._handleMovedWhiteboardItem);
        },
        getNotes:function(whiteboard){
            this.whiteboard = whiteboard;
            this.noteCollection = new NoteCollection(null,{id:this.whiteboard.id});
            
            window.app.subscribeChannel('/note/posted/'+this.whiteboard.id, this.noteCreated);
            
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
            var _id = message.data.id;
            var _x = message.data.x;
            var _y = message.data.y;
            var note = this.noteCollection.get(_id);
            note.set({x:_x,y:_y});
        }
    };
    
    return NoteController;
});