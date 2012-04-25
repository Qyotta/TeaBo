define(
        [ 'jquery', 'underscore', 'backbone', 'modules/note/collection_note',
                'modules/note/view_note', 'modules/note/model_note',
                'modules/note/view_confirm_delete' ],
        function($, _, Backbone, NoteCollection, NoteView, Note,
                ConfirmDeleteView) {

            var NoteController = function(options) {
                _.bindAll(this, 'getNotes', 'getDeleteFlag', 'createNote','noteCreated', 'subscribeChannels','_handleMovedWhiteboardItem','_handleDeletedWhiteboardItem', '_handleEditedNote','deleteNote', '_reportElementOrder', '_handleForegroundWhiteboardItem');
                window.app.eventDispatcher.bind("note:create", this.createNote);
                window.app.eventDispatcher.bind("whiteboard:opened",this.getNotes);
                window.app.eventDispatcher.bind("whiteboard:opened", this.getDeleteFlag());
                window.app.eventDispatcher.bind('handshakeComplete',this.subscribeChannels);
                window.app.eventDispatcher.bind('note:delete', this.deleteNote);
                window.app.eventDispatcher.bind('note:order_change', this._reportElementOrder);

                this.initialize();
            };

            NoteController.prototype = {
                initialize : function() {
                    this.views = [];
                    this.confirmDeleteView = new ConfirmDeleteView();
                },
                subscribeChannels : function() {
                    window.app.subscribeChannel('/whiteboardItem/move/'
                            + this.whiteboard.id,
                            this._handleMovedWhiteboardItem);
                    window.app.subscribeChannel('/whiteboardItem/delete/'
                            + this.whiteboard.id,
                            this._handleDeletedWhiteboardItem);
                    window.app.subscribeChannel('/note/edited/'
                            + this.whiteboard.id, this._handleEditedNote);
                    window.app.subscribeChannel('/note/posted/'
                            + this.whiteboard.id, this.noteCreated);
                    window.app.subscribeChannel('/whiteboardItem/order/'+this.whiteboard.id, this._handleForegroundWhiteboardItem);
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
                                    whiteboardId : self.whiteboard.id
                                });
                            });
                            self.subscribeChannels();
                        }
                    });
                },
                createNote : function() {
                    window.app.publish('/service/note/post/', {
                        x : 400,
                        y : 400,
                        creator : window.app.user.get('email'),
                        whiteboardid : this.whiteboard.id
                    });
                },
                noteCreated : function(message) {
                    var _note = new Note({
                        creator : message.data.creator,
                        x : message.data.x,
                        y : message.data.y
                    });
                    _note.id = message.data.id;
                    if (this.views[_note.id])
                        return;
                    this.noteCollection.add(_note);
                    this.views[_note.id] = new NoteView({
                        model : _note,
                        whiteboardId : this.whiteboard.id
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
                _handleForegroundWhiteboardItem : function(message) {
                    var _id = message.data.id.split('-')[1];
                    var _note = this.noteCollection.get(_id);
                    this.views[_note.id]._handleForegroundWhiteboardItem(message);
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
              //TODO commenting
                /**
                * ?
                *
                * @param {jQueryObject} elem ?
                *
                */
                _reportElementOrder : function (model) {
                    window.app.log("report orderChanged");
                    window.app.publish('/service/whiteboardItem/order', {
                        id : parseInt(model.id),
                        whiteboardid : parseInt(this.whiteboard.id)
                    });
                },
                deleteNote : function(model) {
                    if (typeof model == "undefined" || model == null) {
                        window.app.log('delete-event triggered multiple times');
                    } else {
                        window.app.publish('/service/whiteboardItem/delete', {
                            id : model.id,
                            whiteboardid : this.whiteboard.id
                        });
                    }
                },
                getDeleteFlag : function() {
                    var that = this;
                    $.ajax({
                        url : config.contextPath + "/user/getDeleteFlag.htm",
                        type : 'POST',
                        success : function(jsonData) {
                            if (jsonData.value === false) {
                                that.confirmDeleteView.setFlag(false);
                            } else {
                                that.confirmDeleteView.setFlag(true);
                            }
                        }
                    });
                }
            };

            return NoteController;
        });
