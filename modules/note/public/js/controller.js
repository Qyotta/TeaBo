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
        _.bindAll(this, 'getNotes', 'createNote','noteCreated', '_handleMovedWhiteboardItem','_handleDeletedWhiteboardItem', '_handleEditedNote','deleteNote', '_reportElementOrder', 'handleForegroundWhiteboardItem');
        window.app.eventDispatcher.bind("toolbar:createNote", this.createNote);
        window.app.eventDispatcher.bind("whiteboard:opened",this.getNotes);
        window.app.eventDispatcher.bind('handshakeComplete',this.subscribeChannels);
        window.app.eventDispatcher.bind('note:delete', this.deleteNote);
        window.app.eventDispatcher.bind('note:order_change', this._reportElementOrder);

        this.initialize();
    };

    NoteController.prototype = {
        initialize : function() {
            this.views    = [];
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
            commands.push(new SubscribeCommand('/whiteboardItem/move/'   + this.whiteboard.id, this._handleMovedWhiteboardItem));
            commands.push(new SubscribeCommand('/whiteboardItem/delete/' + this.whiteboard.id, this._handleDeletedWhiteboardItem));
            commands.push(new SubscribeCommand('/note/edited/'           + this.whiteboard.id, this._handleEditedNote));
            commands.push(new SubscribeCommand('/note/posted/'           + this.whiteboard.id, this.noteCreated));
            commands.push(new SubscribeCommand('/whiteboardItem/order/'  + this.whiteboard.id, this.handleForegroundWhiteboardItem));
            window.app.groupCommand.addCommands(commands);
        },
        getNotes : function(whiteboard) {
            this.whiteboard = whiteboard;
            this.noteCollection = new NoteCollection(null, {
                id : this.whiteboard.id
            });

            var self = this;
            this.noteCollection.fetch({
                success : function(collection, response) {
                    collection.each(function(_note) {
                        self.views[_note.id] = new NoteView({
                            model : _note,
                            controller: self,
                        });
                    });
                    self.subscribeChannels();
                }
            });
        },
        createNote : function() {
            window.app.io.publish('/note/post', {
                x : 400,
                y : 400,
                creator : window.app.user.get('email'),
                whiteboardid : this.whiteboard.id
            });
        },
        noteCreated : function(message) {
            var _note = new Note(message);
            
            if (this.views[_note.id])
                return;
            this.noteCollection.add(_note);
            
            var self = this;
            this.views[_note.id] = new NoteView({
                model : _note,
                controller: self,
            });
        },
        _handleMovedWhiteboardItem : function(message) {
            var _id = message.data.id;
            var _x = message.data.x;
            var _y = message.data.y;

            var _note = this.noteCollection.get(_id);
            _note.set({
                x : _x,
                y : _y
            });
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
