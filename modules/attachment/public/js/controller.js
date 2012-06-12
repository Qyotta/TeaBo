define([    
            'jquery', 
            'underscore', 
            'backbone',
            '/core/js/utils/model_command.js',
            '/core/js/utils/subscribe_command.js',
            '/attachment/js/views/attachment.js', 
            '/attachment/js/views/confirm_delete.js',
            '/attachment/js/views/upload.js'
            ], function($, _, Backbone, ModelCommand, SubscribeCommand, AttachmentView,  ConfirmDeleteView, UploadDialogView){
    
    var AttachmentController = function(options){

        _.bindAll(this, 'getAttachments', 'createAttachment','loadedAttachment','deletedAttachment', '_handleEditedAttachment', 'assignmentSynced','whiteboardClosed','subscribeChannels');
        
        window.app.eventDispatcher.bind("whiteboardItem:loaded:attachment", this.loadedAttachment);
        window.app.eventDispatcher.bind("whiteboardItem:deleted:attachment", this.deletedAttachment);
        
        window.app.eventDispatcher.bind('attachment:delete', this.deleteAttachment);
        
        window.app.eventDispatcher.bind("toolbar:createAttachment", this.createAttachment);
        
        window.app.eventDispatcher.bind("whiteboard:opened",this.getAttachments);
        window.app.eventDispatcher.bind("whiteboard:closed",this.whiteboardClosed);
        window.app.eventDispatcher.bind('assignment:synced', this.assignmentSynced);
        this.initialize();
    };
    
    AttachmentController.prototype = {
            initialize : function() {
                this.views    = [];
                this.assignmentSynced = false;
                this.uploadDialogView = new UploadDialogView({controller:this});
                this.confirmDeleteView = new ConfirmDeleteView();
            },
            toolbarTool: {
                name: 'Attachments',
                action: 'createAttachment',
                imageURL: '/attachment/images/new_file.png',
                imageTitle: 'create a new attachment'
            },
            subscribeChannels : function() {
                var commands = [];
                commands.push(new SubscribeCommand('/attachment/edited/'         +this.whiteboard.id,this._handleEditedAttachment))
                window.app.groupCommand.addCommands(commands);
            },
            loadedAttachment:function(_attachment){
                if (this.checkIfViewExists(_attachment))return;
                var view = new AttachmentView({
                    model : _attachment,
                    controller: this,
                });
                view.render();
                
                this.views.push(view);
            },
            getAttachments : function(whiteboard) {
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
                this.renderAttachments();
            },
            renderAttachments : function(){
                if(!this.assignmentSynced)return false;
                _.each(this.views,function(view){
                    view.render();
                });
            },
            whiteboardClosed:function(){
                this.assignmentSynced = false;
                this.views = [];
            },
            createAttachment : function() {
                this.uploadDialogView.showUploadDialog(this.whiteboard);
                this.uploadDialogView = new UploadDialogView({controller:this});
            },
            uploadAttachment:function(form){
                
                form.submit();
                $('input[type=file], textarea',form).val("");
                
                var self = this;
                $('#uploadFrame', top.document).load(function(){
                    var attachment = eval("("+$(this).contents().text()+")");
                    
                    if(attachment['error'] != undefined){
                        alert("Your File was not valid.");
                    }
                    else {
                        window.app.log(self.whiteboard.id);
                        window.app.groupCommand.addCommands(new ModelCommand(
                            '/whiteboardItem/posted/'+self.whiteboard.id, attachment
                        ));
                    }
                });
            },
            _handleEditedAttachment : function(message) {
                var _id = message.id;
                var _shortDescription = message.shortDescription;
                var view = this.findViewById(_id);
                var _attachment = view.model;
                _attachment.get('content').set({ shortDescription : _shortDescription });
            },
            deletedAttachment : function(_attachment){
                var view = this.findViewById(_image.id);
                if(view)view.remove();
                this.confirmDeleteView = new ConfirmDeleteView();
            },
            deleteAttachment : function(message) {
                //delete physical file
                $.ajax({
                    url : '/attachment/delete/'+message.id
                });
            }
    }
    
    return AttachmentController;
});