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
        _.bindAll(this,'getAttachments','createAttachment','deleteAttachment','_handlePostedAttachment','_handleUploadCompleteAttachment','_handleUploadFailedAttachment');
        window.app.eventDispatcher.bind("attachment:create",this.createAttachment);
        window.app.eventDispatcher.bind("whiteboard:opened",this.getAttachments);
        window.app.eventDispatcher.bind('attachment:delete',this.deleteAttachment);
        this.initialize();
    };
    
    AttachmentController.prototype = {
        initialize: function() {
            this.views = [];
            this.confirmDeleteView = new ConfirmDeleteView();
            this.uploadDialog = new UploadDialog({controller:this});
        },
        subscribeChannels:function(){
            window.app.subscribeChannel('/whiteboardItem/move/'+this.whiteboard.id,this._handleMovedWhiteboardItem);
            window.app.subscribeChannel('/whiteboardItem/delete/'+this.whiteboard.id,this._handleDeletedWhiteboardItem);
            window.app.subscribeChannel('/attachment/posted/'+this.whiteboard.id,this._handlePostedAttachment);
            window.app.subscribeChannel('/attachment/upload/complete/'+this.whiteboard.id,this._handleUploadCompleteAttachment);
            window.app.subscribeChannel('/attachment/upload/remove/'+this.whiteboard.id,this._handleUploadFailedAttachment);
        },
        getAttachments:function(whiteboard){
            this.whiteboard = whiteboard;
            this.attachmentCollection = new AttachmentCollection(null,{id:this.whiteboard.id});
            window.app.log("load attachments");
            var self = this;
            this.attachmentCollection.fetch({
                success:function(collection, response){
                    collection.each(function(_attachment) {
                        self.views[_attachment.id] = new AttachmentView({ model:_attachment, whiteboardId: self.whiteboard.id, controller:this});
                    });
                    self.subscribeChannels();
                }
            });
        },
        createAttachment:function(){
            window.app.eventDispatcher.trigger("attachment:view_upload_dialog",this.whiteboard);
        },
        deleteAttachment:function(model) {
            window.app.publish( '/service/whiteboardItem/delete', {
                id : model.id,
                whiteboardid : this.whiteboard.id
            });
        },
        _handleMovedWhiteboardItem:function(message) {
            var _id     = message.data.id;
            var _x      = message.data.x;
            var _y      = message.data.y;
            
            var _attachment   = this.attachmentCollection.get(_id);
            _attachment.set({x:_x,y:_y});

            window.app.log("attachment moved("+_id+",x:"+_x+",y:"+_y+")");
        },
        _handleDeletedWhiteboardItem:function(message){
            var _id = message.data.id;
            var _attachment = this.attachmentCollection.get(_id);
            if(_attachment){
                this.attachmentCollection.remove(_attachment);
                this.views[_attachment.id].remove();
            }
        },
        _handlePostedAttachment:function(message){
        	    var _id       = message.data.id,
        	        _creator  = message.data.creator,
        	        _filename = message.data.filename,
        	        _x        = message.data.x,
        	        _y        = message.data.y,
        	        _uid      = message.data.uid,
        	        _image	  = config.contextPath;
        	    
        	    window.app.log("posted attachment "+_id+" uid:"+_uid+" activeUpload:"+this.activeUpload);
        	    
        	    var _attachment = new Attachment({
        	    	id:_id,
        	    	creator : _creator,
        	    	filename: _filename,
                    x       : _x,
                    y       : _y,
                    image	: _image,
                    uid		: _uid,
                    complete: false
        	    });
        	    
	            if(this.views[_attachment.id]!=null){
	            	window.app.log("attachment already exists");
	            	return;
	            }
        	    
	            this.attachmentCollection.add(_attachment);
	            
        	    this.views[_attachment.id] = new AttachmentView({ model: _attachment, whiteboardId: this.whiteboard.id,controller:this });
        	    
        	    if (this.activeUpload != null && _uid === this.activeUpload[1]){
        	        this._uploadFile(_id);
        	    }
        },
        _handleUploadCompleteAttachment:function(message){
        	window.app.log("upload complete");
        	var _id = message.data.id;
        	var _attachment = this.attachmentCollection.get(_id);
        	window.app.log(_attachment);
        	_attachment.set({complete:true});
        },
        _handleUploadFailedAttachment:function(message){
        	var _id = message.id;
        	var _attachment = this.attachmentCollection.get(_id);
        	if(_attachment){
                this.noteCollection.remove(_attachment);
                this.views[_attachment.id].remove();
            }
        },
        _uploadFile:function(id){
        	var form = this.activeUpload[0];
        	$('#uploadId',form).val(id);
            form.submit();
            $('input[type=file], textarea',form).val("");
            var self = this;
            $('#uploadFrame', top.document).load(function(){
                var attachment = eval("("+$(this).contents().text()+")");

                if(attachment['error'] != undefined){
                    alert("Your File was not valid.");
                    window.app.publish('/service/attachment/remove', {
                        id : parseInt(attachment['id']),
                        whiteboardid : self.whiteboard.id
                    });
                }
                else {
                	window.app.log("attachment upload complete");
                	window.app.log(self.whiteboard.id);
                	window.app.publish('/service/attachment/complete', {
                        id : parseInt(attachment['id']),
                        whiteboardid : self.whiteboard.id
                    });
                }
            });
            activeUpload = null;
        }

    };
    
    return AttachmentController;
});