define([
    'jquery', 
    'underscore', 
    'backbone',
    '/core/js/utils/model_command.js',
    '/core/js/utils/subscribe_command.js',
    '/note/js/views/note.js', 
    '/note/js/views/confirm_delete.js'
], function($, _, Backbone, ModelCommand, SubscribeCommand, NoteView, ConfirmDeleteView) {
    var NoteController = function(options) {
        _.bindAll(this, 'getNotes', 'createNote','loadedNote','deletedNote', '_handleEditedNote', '_reportElementOrder', 'handleForegroundWhiteboardItem','assignmentSynced','whiteboardClosed','subscribeChannels');
        window.app.eventDispatcher.bind("whiteboardItem:loaded:note", this.loadedNote);
        window.app.eventDispatcher.bind("whiteboardItem:deleted:note", this.deletedNote);
        
        window.app.eventDispatcher.bind("toolbar:createNote", this.createNote);
        window.app.eventDispatcher.bind("whiteboard:opened",this.getNotes);
        window.app.eventDispatcher.bind("whiteboard:closed",this.whiteboardClosed);
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
            this.subscribeChannels();
        },
        findViewById:function(id){
            var result=null;
            _.each(this.views,function(view){
                if(id === view.model.id){
                    result = view;
                    return;
                }
            });
            return result;
        },
        checkIfViewExists : function(model){
            var view = this.findViewById(model.id);
            return view != null;
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
            window.app.io.publish('/service/whiteboardItem/post', {
                x : 400,
                y : 400,
                type : 'note',
                creator : window.app.user.id,
                whiteboardid : this.whiteboard.id,
                content : {text:''}
            });
        },
        handleForegroundWhiteboardItem : function(message) {
            var _id = message.data.id.split('-')[1];
            var _note = this.noteCollection.get(_id);
            this.views[_note.id].handleForegroundWhiteboardItem(message);
        },
        _handleEditedNote : function(message) {
            var _id = message.id;
            var _text = message.text;
            var view = this.findViewById(_id);
            var _note = view.model;
            _note.get('content').set({ text : _text });
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
        deletedNote : function(_note){
            var view = this.findViewById(_note.id);
            if(view)view.remove();
        }
    };

    return NoteController;
});
