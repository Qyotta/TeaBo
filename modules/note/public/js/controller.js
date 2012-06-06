define([
    'jquery', 
    'underscore', 
    'backbone',
    '/core/js/utils/model_command.js',
    '/core/js/utils/subscribe_command.js',
    '/note/js/collection/note.js',
    '/note/js/views/note.js', 
    '/note/js/model/note.js',
    '/note/js/views/confirm_delete.js'
], function($, _, Backbone, ModelCommand, SubscribeCommand, NoteCollection, NoteView, Note, ConfirmDeleteView) {
    var NoteController = function(options) {
        _.bindAll(this, 'getNotes', 'createNote','noteCreated','loadedNote','_handleMovedWhiteboardItem','_handleDeletedWhiteboardItem', '_handleEditedNote','deleteNote', '_reportElementOrder', 'handleForegroundWhiteboardItem','assignmentSynced','whiteboardClosed');
        
        window.app.eventDispatcher.bind("whiteboardItem:loaded:note", this.loadedNote);
        
        
        window.app.eventDispatcher.bind("toolbar:createNote", this.createNote);
        window.app.eventDispatcher.bind("whiteboard:opened",this.getNotes);
        window.app.eventDispatcher.bind("whiteboard:closed",this.whiteboardClosed);
        window.app.eventDispatcher.bind('handshakeComplete',this.subscribeChannels);
        window.app.eventDispatcher.bind('note:delete', this.deleteNote);
        window.app.eventDispatcher.bind('note:order_change', this._reportElementOrder);
        window.app.eventDispatcher.bind('assignment:synced', this.assignmentSynced);

        this.initialize();
    };

    NoteController.prototype = {
        initialize : function() {
            this.views    = [];
            this.assignmentSynced = false;
            this.confirmDeleteView = new ConfirmDeleteView();
        },
        toolbarTool: {
            name: 'Notes',
            action: 'createNote',
            imageURL: '/note/images/new_note.png',
            imageTitle: 'create a new note'
        },
        subscribeChannels : function() {
            var commands = [];
            commands.push(new SubscribeCommand('/note/edited/'           + this.whiteboard.id, this._handleEditedNote));
            commands.push(new SubscribeCommand('/note/posted/'           + this.whiteboard.id, this.noteCreated));
            commands.push(new SubscribeCommand('/whiteboardItem/order/'  + this.whiteboard.id, this.handleForegroundWhiteboardItem));
            window.app.groupCommand.addCommands(commands);
        },
        loadedNote:function(_note){
            if (this.checkIfViewExists(_note))return;
            
            var view = new NoteView({
                model : _note,
                controller: this,
            });
            view.render();
            
            this.views.push(view);
        },
        getNotes : function(whiteboard) {
            this.whiteboard = whiteboard;
            this.views = [];
        },
        checkIfViewExists : function(model){
            _.each(this.views,function(view){
                if(model.id === view.model.id){
                    return true;
                }
            });
            return false;
        },
        assignmentSynced : function(){
            this.assignmentSynced = true;
            this.renderNotes();
        },
        renderNotes : function(){
            if(!this.assignmentSynced)return false;
            _.each(this.views,function(view){
                view.render();
            });
        },
        whiteboardClosed:function(){
            this.assignmentSynced = false;
            this.views = [];
        },
        createNote : function() {
            window.app.io.publish('/service/note/post', {
                x : 400,
                y : 400,
                creator : window.app.user.id,
                whiteboardid : this.whiteboard.id
            });
        },
        noteCreated : function(message) {
            console.log("note created",message);
            var _note = new Note(message);
            console.log(_note);
            if (this.checkIfViewExists(_note))return;
            this.noteCollection.add(_note);
            
            var self = this;
            var view = new NoteView({
                model : _note,
                controller: self,
            });
            view.render();
            this.views.push(view);
        },
        _handleMovedWhiteboardItem : function(message) {
            var _id = message.id;
            var _x = message.x;
            var _y = message.y;
            
            var _note = this.noteCollection.get(_id);
            _note.set({ x : _x, y : _y });
        },
        handleForegroundWhiteboardItem : function(message) {
            var _id = message.data.id.split('-')[1];
            var _note = this.noteCollection.get(_id);
            this.views[_note.id].handleForegroundWhiteboardItem(message);
        },
        _handleDeletedWhiteboardItem : function(message) {
            var _id = message.data.id;
            var _note = this.noteCollection.get(_id);
            if (_note) {
                this.noteCollection.remove(_note);
                this.views[_note.id].remove();
            }
        },
        _handleEditedNote : function(message) {
            var _id = message.data.id;
            var _text = message.data.text;

            var _note = this.noteCollection.get(_id);
            _note.set({
                text : _text
            });
        },
        _reportElementOrder : function (model) {
            window.app.groupCommand.addCommands(new ModelCommand(
                '/service/whiteboardItem/order', 
                {
                    id : parseInt(model.id),
                    whiteboardid : parseInt(this.whiteboard.id)
                }
            ));
        },
        deleteNote : function(model) {
            if (typeof model == "undefined" || model == null) {
                window.app.log('delete-event triggered multiple times');
            } else {
                window.app.groupCommand.addCommands(new ModelCommand(
                    '/service/whiteboardItem/delete', 
                    {
                        id : model.id,
                        whiteboardid : this.whiteboard.id
                    }
                ));
            }
        }
    };

    return NoteController;
});
