define([
    'jquery',
    'underscore',
    'backbone',
    '/core/js/utils/subscribe_command.js',
    '/core/js/utils/model_command.js',
    '/attachment/js/collection/attachment.js',
    '/attachment/js/views/attachment.js',
    '/attachment/js/model/attachment.js',
    '/attachment/js/views/upload_dialog.js',
    '/attachment/js/views/confirm_delete.js'
], function($, _, Backbone, SubscribeCommand, ModelCommand, AttachmentCollection, AttachmentView, Attachment, UploadDialog, ConfirmDeleteView){
    
    var AttachmentController = function(options){
        _.bindAll(this,'getAttachments','createAttachment','deleteAttachment', 'handleDeletedWhiteboardItem', 'handlePostedAttachment','handleUploadCompleteAttachment','handleUploadFailedAttachment');
        window.app.eventDispatcher.bind("attachment:create",this.createAttachment);
        window.app.eventDispatcher.bind("whiteboard:opened",this.getAttachments);
        window.app.eventDispatcher.bind('attachment:delete',this.deleteAttachment);
        this.initialize();
    };
    
    AttachmentController.prototype = {
        initialize: function() {
            this.views    = [];
            this.confirmDeleteView = new ConfirmDeleteView();
            this.uploadDialog = new UploadDialog({controller:this});
        },
        subscribeChannels:function(){
            var commands = [];
            commands.push(new SubscribeCommand('/attachment/posted/'          +this.whiteboard.id,this.handlePostedAttachment));
            commands.push(new SubscribeCommand('/attachment/upload/complete/' +this.whiteboard.id,this.handleUploadCompleteAttachment));
            commands.push(new SubscribeCommand('/attachment/upload/remove/'   +this.whiteboard.id,this.handleUploadFailedAttachment));
            window.app.groupCommand.addCommands(commands);
        },
        getAttachments:function(whiteboard){
            this.whiteboard = whiteboard;
            this.attachmentCollection = new AttachmentCollection(null,{id:this.whiteboard.id});
            var self = this;
            this.attachmentCollection.fetch({
                success:function(collection, response){
                    collection.each(function(attachment) {
                        self.views[attachment.id] = new AttachmentView({ model:attachment, controller:this});
                    });
                    self.subscribeChannels();
                }
            });
        },
        createAttachment:function(){
            window.app.eventDispatcher.trigger("attachment:view_upload_dialog",this.whiteboard);
        },
        deleteAttachment:function(model) {
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
        },
        handleMovedWhiteboardItem:function(message) {
            console.log(message);
            var id     = message.id;
            var x      = message.x;
            var y      = message.y;
            
            var attachment   = this.attachmentCollection.get(id);
            attachment.set({x:x,y:y});
        },
        handleDeletedWhiteboardItem:function(message){
            var id = message.data.id;
            var attachment = this.attachmentCollection.get(id);
            if(attachment){
                this.attachmentCollection.remove(attachment);
                this.views[attachment.id].remove();
            }
        },
        handlePostedAttachment:function(message){
                var id          = message.data.id,
                    creator     = message.data.creator,
                    description = message.data.text,
                    filename    = message.data.filename,
                    x           = message.data.x,
                    y           = message.data.y,
                    uid         = message.data.uid,
                    image       = config.contextPath;
                    
                var attachment = new Attachment({
                    id          : id,
                    creator     : creator,
                    description : description,
                    filename    : filename,
                    x           : x,
                    y           : y,
                    image       : image,
                    uid         : uid,
                    complete    : false
                });
                if(this.views[attachment.id]!=null){
                    window.app.log("attachment already exists");
                    return;
                }
                this.attachmentCollection.add(attachment);
                this.views[attachment.id] = new AttachmentView({ model: attachment,controller:this });
                if (this.activeUpload != null && uid === this.activeUpload[1]){
                    this.uploadFile(id);
                }
        },
        handleUploadCompleteAttachment:function(message){
            var id = message.data.id;
            var attachment = this.attachmentCollection.get(id);
            attachment.set({complete:true});
        },
        handleUploadFailedAttachment:function(message){
            var id = message.data.id;
            var attachment = this.attachmentCollection.get(id);
            if(attachment){
                this.noteCollection.remove(attachment);
                this.views[attachment.id].remove();
            }
        },
        uploadFile:function(id){
            var form = this.activeUpload[0];
            $('#uploadId',form).val(id);
            form.submit();
            $('input[type=file], textarea',form).val("");
            var self = this;
            $('#uploadFrame', top.document).load(function(){
                var attachment = eval("("+$(this).contents().text()+")");
                if(attachment['error'] != undefined){
                    alert("Your File was not valid.");
                    window.app.groupCommand.addCommands(new ModelCommand(
                        '/service/attachment/remove', 
                        {
                            id : parseInt(attachment['id']),
                            whiteboardid : self.whiteboard.id
                        }
                    ));
                }
                else {
                    window.app.log("attachment upload complete");
                    window.app.log(self.whiteboard.id);
                    window.app.groupCommand.addCommands(new ModelCommand(
                        '/service/attachment/complete', 
                        {
                            id : parseInt(attachment['id']),
                            whiteboardid : self.whiteboard.id
                        }
                    ));
                }
            });
            activeUpload = null;
        }

    };
    
    return AttachmentController;
});