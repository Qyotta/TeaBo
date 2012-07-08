define([
    'jquery',
    'underscore',
    'backbone',
    '/core/js/utils/model_command.js',
    '/core/js/utils/subscribe_command.js',
    '/note/js/views/note.js'
], function($, _, Backbone, ModelCommand, SubscribeCommand, NoteView) {
    var NoteController = function(options) {
        _.bindAll(this, 'whiteboardOpened', 'createNote','loadedNote','deletedNote', '_handleEditedNote', '_reportElementOrder', 'handleForegroundWhiteboardItem','assignmentSynced','whiteboardClosed','subscribeChannels');
        window.app.eventDispatcher.bind("whiteboardItem:loaded:note", this.loadedNote);
        window.app.eventDispatcher.bind("whiteboardItem:deleted:note", this.deletedNote);
        
        window.app.eventDispatcher.bind("toolbar:createNote", this.createNote);
        window.app.eventDispatcher.bind("whiteboard:opened",this.whiteboardOpened);
        window.app.eventDispatcher.bind("whiteboard:closed",this.whiteboardClosed);
        window.app.eventDispatcher.bind('note:delete', this.deleteNote);
        window.app.eventDispatcher.bind('note:order_change', this._reportElementOrder);
        window.app.eventDispatcher.bind('assignment:synced', this.assignmentSynced);
        this.initialize();
    };

    NoteController.prototype = {
        initialize : function() {
            this.views    = [];
            this.isAssignmentSynced = false;
        },
        index: 2,
        toolbarTool: {
            name: 'Notes',
            action: 'createNote',
            imageURL: '/note/images/new_note.png',
            imageTitle: 'create a new note'
        },
        subscribeChannels:function(){
            this.subscriptions = [];
            this.subscriptions.push(window.app.io.subscribe('/note/edited/'           + this.whiteboard.id, this._handleEditedNote));
            this.subscriptions.push(window.app.io.subscribe('/whiteboardItem/order/'  + this.whiteboard.id, this.handleForegroundWhiteboardItem));
        },
        unsubscribeChannels:function(){
            _.each(this.subscriptions,function(subscription){
                subscription.cancel();
            });
        },
        loadedNote:function(_note){
            if (this.checkIfViewExists(_note))return;
            var view = new NoteView({
                model : _note,
                controller: this
            });
            if(this.isAssignmentSynced){
                this.addSingleNote(view);
            }
            this.views.push(view);
        },
        whiteboardOpened : function(whiteboard) {
            this.whiteboard = whiteboard;
            this.views = [];
            this.subscribeChannels();
            this.isAssignmentSynced = false;
        },
        findViewById:function(id){
            for(var i=0;i<this.views.length;i++){
                var view = this.views[i];
                if(id === view.model.id){
                    return view;
                }
            }
            return null;
        },
        checkIfViewExists : function(model){
            var view = this.findViewById(model.id);
            return view !== null;
        },
        assignmentSynced : function(){
            this.isAssignmentSynced = true;
            this.renderNotes();
        },
        addSingleNote:function(view){
            $("#whiteboard").append($(view.render().el));
        },
        renderNotes : function(){
            if(!this.isAssignmentSynced)return false;
            var self = this;
            _.each(this.views,function(view){        
                self.addSingleNote(view);
            });
        },
        whiteboardClosed:function(){
            this.isAssignmentSynced = false;
            _.each(this.views,function(view){
                view.destroy();
            });
            this.unsubscribeChannels();
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
                    id : parseInt(model.id,10),
                    whiteboardid : parseInt(this.whiteboard.id,10)
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
