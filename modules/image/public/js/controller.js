define([    
            'jquery', 
            'underscore', 
            'backbone',
            '/core/js/utils/model_command.js',
            '/core/js/utils/subscribe_command.js',
            '/image/js/views/image.js', 
            '/image/js/views/confirm_delete.js',
            '/image/js/views/upload.js'
            ], function($, _, Backbone, ModelCommand, SubscribeCommand, ImageView,  ConfirmDeleteView, UploadDialogView){
    
    var ImageController = function(options){

        _.bindAll(this, 'getImages', 'createImage','loadedImage','deletedImage', '_handleEditedImage', 'assignmentSynced','whiteboardClosed','subscribeChannels');
        
        window.app.eventDispatcher.bind("whiteboardItem:loaded:image", this.loadedImage);
        window.app.eventDispatcher.bind("whiteboardItem:deleted:image", this.deletedImage);
        
        window.app.eventDispatcher.bind("toolbar:createImage", this.createImage);
        
        window.app.eventDispatcher.bind("whiteboard:opened",this.getImages);
        window.app.eventDispatcher.bind("whiteboard:closed",this.whiteboardClosed);
        window.app.eventDispatcher.bind('assignment:synced', this.assignmentSynced);
        this.initialize();
    };
    
    ImageController.prototype = {
            initialize : function() {
                this.views    = [];
                this.assignmentSynced = false;
                this.uploadDialogView = new UploadDialogView({controller:this});
                //this.confirmDeleteView = new ConfirmDeleteView();
            },
            toolbarTool: {
                name: 'Images',
                action: 'createImage',
                imageURL: '/image/images/new_image.png',
                imageTitle: 'create a new image'
            },
            subscribeChannels : function() {
                var commands = [];
                commands.push(new SubscribeCommand('/image/edited/'           + this.whiteboard.id, this._handleEditedImage));
                window.app.groupCommand.addCommands(commands);
            },
            loadedImage:function(_image){
                if (this.checkIfViewExists(_image))return;
                
                var view = new ImageView({
                    model : _image,
                    controller: this,
                });
                view.render();
                
                this.views.push(view);
            },
            getImages : function(whiteboard) {
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
                this.renderImages();
            },
            renderImages : function(){
                if(!this.assignmentSynced)return false;
                _.each(this.views,function(view){
                    view.render();
                });
            },
            whiteboardClosed:function(){
                this.assignmentSynced = false;
                this.views = [];
            },
            createImage : function() {
                this.uploadDialogView.showUploadDialog(this.whiteboard);
                /*
                window.app.io.publish('/service/whiteboardItem/post', {
                    x : 400,
                    y : 400,
                    type : 'image',
                    creator : window.app.user.id,
                    whiteboardid : this.whiteboard.id,
                    content : {extension: '.png', scale: 1.0}
                });
                */
            },
            uploadImage:function(form){
                form.submit();
                $('input[type=file], textarea',form).val("");
                var self = this;
                $('#uploadFrame', top.document).load(function(){
                    var image = eval("("+$(this).contents().text()+")");
                    if(image['error'] != undefined){
                        alert("Your File was not valid.");
                    }
                    else {
                        window.app.log(self.whiteboard.id);
                        window.app.groupCommand.addCommands(new ModelCommand(
                            '/whiteboardItem/posted/'+self.whiteboard.id, image
                        ));
                    }
                });
            },
            _handleEditedImage : function(message) {
                var _id = message.id;
                var _scale = message.scale;
                var view = this.findViewById(_id);
                var _note = view.model;
                _note.get('content').set({ scale : _scale });
            },
            deletedImage : function(_image){
                var view = this.findViewById(_image.id);
                if(view)view.remove();
            }
    }
    
    return ImageController;
});