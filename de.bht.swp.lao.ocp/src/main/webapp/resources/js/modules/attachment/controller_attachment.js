define([
    'jquery',
    'underscore',
    'backbone',
    'modules/attachment/collection_attachment',
    'modules/attachment/view_attachment',
    'modules/attachment/model_attachment',
    'modules/attachment/view_upload_dialog',
    'modules/attachment/view_confirm_delete'
], function($, _, Backbone,AttachmentCollection,AttachmentView,Attachment, UploadDialog,ConfirmDeleteView){
    
    var AttachmentController = function(options){
        window.app.log("attachment controller");
        _.bindAll(this,'getAttachments','createAttachment');
        window.app.eventDispatcher.bind("attachment:create",this.createAttachment);
        window.app.eventDispatcher.bind("whiteboard:opened",this.getAttachments);
        window.app.eventDispatcher.bind('attachment:delete',this.deleteNote);
        this.initialize();
    };
    
    AttachmentController.prototype = {
        initialize: function() {
            this.views = [];
            this.confirmDeleteView = new ConfirmDeleteView();
            this.uploadDialog = new UploadDialog();
        },
        subscribeChannels:function(){
            window.app.subscribeChannel('/whiteboardItem/move/'+this.whiteboard.id,this._handleMovedWhiteboardItem);
            window.app.subscribeChannel('/whiteboardItem/delete/'+this.whiteboard.id,this._handleDeletedWhiteboardItem);
//            window.app.subscribeChannel('/note/edited/'+this.whiteboard.id,this._handleEditedNote);
//            window.app.subscribeChannel('/note/posted/'+this.whiteboard.id, this.noteCreated);
        },
        getAttachments:function(whiteboard){
            this.whiteboard = whiteboard;
            this.attachmentCollection = new AttachmentCollection(null,{id:this.whiteboard.id});
            
            var self = this;
            this.attachmentCollection.fetch({
                success:function(collection, response){
                    collection.each(function(_attachment) {
                        self.views[_attachment.id] = new AttachmentView({ model:_attachment, whiteboardId: self.whiteboard.id});
                    });
                    self.subscribeChannels();
                }
            });
        },
        createAttachment:function(){
            window.app.eventDispatcher.trigger("attachment:view_upload_dialog",this.whiteboard);
        },
        _handleMovedWhiteboardItem:function(message) {
            var _id     = message.data.id;
            var _x      = message.data.x;
            var _y      = message.data.y;
            
            var _note   = this.noteCollection.get(_id);
            _note.set({x:_x,y:_y});

            window.app.log("attachment moved("+_id+",x:"+_x+",y:"+_y+")");
        },
        _handleDeletedWhiteboardItem:function(message){
            var _id = message.data.id;
            var _attachment = this.noteCollection.get(_id);
            if(_attachment){
                this.noteCollection.remove(_attachment);
                this.views[_attachment.id].remove();
            }
        },

    };
    
    return AttachmentController;
});