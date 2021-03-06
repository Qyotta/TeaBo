define([
    'jquery',
    'underscore',
    'backbone',
    '/core/js/utils/model_command.js',
    '/core/js/utils/subscribe_command.js',
    '/attachment/js/views/attachment.js',
    '/attachment/js/views/upload.js'
], function($, _, Backbone, ModelCommand, SubscribeCommand, AttachmentView, UploadDialogView){

    var AttachmentController = function(options){

        _.bindAll(this, 'whiteboardOpened', 'createAttachment','loadedAttachment','deletedAttachment', '_handleEditedAttachment', 'assignmentSynced','whiteboardClosed','subscribeChannels');
        
        window.app.eventDispatcher.bind("whiteboardItem:loaded:attachment", this.loadedAttachment);
        window.app.eventDispatcher.bind("whiteboardItem:deleted:attachment", this.deletedAttachment);
        window.app.eventDispatcher.bind('attachment:delete', this.deleteAttachment);
        window.app.eventDispatcher.bind("toolbar:createAttachment", this.createAttachment);
        window.app.eventDispatcher.bind("whiteboard:opened",this.whiteboardOpened);
        window.app.eventDispatcher.bind("whiteboard:closed",this.whiteboardClosed);
        window.app.eventDispatcher.bind('assignment:synced', this.assignmentSynced);
        this.initialize();
    };
    
    AttachmentController.prototype = {
            activeForm:null,
            initialize : function() {
                this.views             = [];
                this.assignmentSynced  = false;
                this.uploadDialogView  = new UploadDialogView({controller:this});
            },
            index: 3,
            toolbarTool: {
                name: 'Attachments',
                action: 'createAttachment',
                imageURL: '/attachment/images/new_file.png',
                imageTitle: 'create a new attachment'
            },
            subscribeChannels:function(){
                this.subscriptions = [];
                this.subscriptions.push(window.app.io.subscribe('/attachment/edited/'         +this.whiteboard.id,this._handleEditedAttachment));
                this.subscriptions.push(window.app.io.subscribe('/whiteboardItem/order/'  + this.whiteboard.id, this.handleForegroundWhiteboardItem));
            },
            unsubscribeChannels:function(){
                _.each(this.subscriptions,function(subscription){
                    subscription.cancel();
                });
            },
            loadedAttachment:function(_attachment){
                if(this.activeForm !== null && _attachment.get('content').get('uid') === this.activeForm[0]){
                    this.uploadAttachment(_attachment.id);
                }
                if (this.checkIfViewExists(_attachment))return;
                var view = new AttachmentView({
                    model : _attachment,
                    controller: this
                });
                
                $("#whiteboard").append($(view.render().el));
                this.views.push(view);
            },
            whiteboardOpened : function(whiteboard) {
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
                return view !== null;
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
                this.unsubscribeChannels();
            },
            createAttachment : function() {
                this.uploadDialogView.showUploadDialog();
                this.uploadDialogView = new UploadDialogView({controller:this});
            },
            generateUploadAttachment:function(form){
                var _uid = new Date().getTime();
                var _ext = $('input[type=file]', form).val().split('.').pop();
                
                window.app.groupCommand.addCommands(new ModelCommand(
                    '/service/whiteboardItem/post', {
                        creator     : window.app.user.id,
                        whiteboardid : this.whiteboard.id,
                        content     : {
                            shortDescription: $('textarea',form).val(), filename:'',
                            extension:_ext,
                            complete:false,
                            uid: _uid
                        },
                        type        : 'attachment',
                        x           : 400,
                        y           : 400
                    }
                ));
                
                this.activeForm = [_uid, form];
            },
            uploadAttachment:function(_id){
                var form = this.activeForm[1];
                $('input[name=id]',form).val(_id);
                
                //trigger upload
                form.submit();
                $('input[type=file], textarea',form).val("");
                
                var self = this;
                $('#uploadFrame', top.document).load(function(){
                    var attachment = eval("("+$(this).contents().text()+")");
                    if(attachment['error'] !== undefined){
                        alert("Your File was not valid.");
                    }
                    else {
                        window.app.log(self.whiteboard.id);
                        window.app.groupCommand.addCommands(new ModelCommand(
                            '/service/attachment/edit', {
                                id : _id,
                                complete : true,
                                whiteboardid : self.whiteboard.id
                            }
                        ));
                    }
                });
                this.activeForm = null;
            },
            _handleEditedAttachment : function(message) {
                var _id = message.id;
                var view = this.findViewById(_id);
                var _attachment = view.model;
                _attachment.get('content').set({
                    filename : message.filename,
                    extension : message.extension,
                    complete:message.complete
                });
                view.changed();
            },
            deletedAttachment : function(_attachment){
                var view = this.findViewById(_attachment.id);
                if(view)view.remove();
            },
            deleteAttachment : function(message) {
                //delete physical file
                $.ajax({
                    url : '/attachment/delete/'+message.id
                });
            }
    };
    
    return AttachmentController;
});