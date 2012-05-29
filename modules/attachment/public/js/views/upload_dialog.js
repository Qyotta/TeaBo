define([
    'jquery', 
    'underscore', 
    'backbone', 
    '/core/js/utils/model_command.js',
    '/core/js/views/dialogs/dialog.js',
    'text!/attachment/templates/upload_dialog.html'
], function($, _, Backbone, ModelCommand, Dialog, uploadDialogTemplate) {
    var UploadDialog = Dialog.extend({
        el : $('#dialogs'),
        initialize : function(options) {
            _.bindAll(this, 'showUploadDialog');
            this.controller = options.controller;
            window.app.eventDispatcher.bind("attachment:view_upload_dialog", this.showUploadDialog);
        },
        events : {
            'click #uploadContainer button.cancel' : 'hideConfirmDialog',
            'change #uploadContainer input[type="file"]':'fileChanged',
            'click #uploadContainer #fileupload input[type=submit]':'postAttachment',
        },
        render : function() {
            var data = {
                whiteboard : this.whiteboard,
                _ : _,
            };
            var compiledTemplate = _.template(uploadDialogTemplate, data);
            this.el.html(compiledTemplate);
        },
        showUploadDialog : function(whiteboard) {
            this.whiteboard = whiteboard;
            this.showDialog();
        },
        hideConfirmDialog : function(evt) {
            evt.preventDefault();
            this.whiteboard = null;
            this.hideDialog();
        },
        fileChanged:function(){
            var input = $('#uploadContainer #fileupload input[type="file"]');
            var filename = input.val();
            var fileExtensions = [".pdf",".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".odt", ".odp", ".odf"];
            
            var found = false;
            for( var index in fileExtensions ){
                var ext = fileExtensions[index];
                if( (filename.toLowerCase().indexOf(ext, filename.length - ext.length)) !== -1){ found = true; }
            }
            if(!found){
                alert("not allowed");
                input.val("");
            }
        },
        postAttachment:function(event) {
            event.preventDefault();
            
            // subtract the whiteboard position to create an attachment inside viewport
            posx = Math.floor(Math.random() * 700);
            posy = Math.floor(Math.random() * 400);
            
            var _creator  = window.app.user.get('email');
            var _x        = posx;
            var _y        = posy;
            var _text     = $('#uploadContainer #fileupload textarea[name=shortDescription]').val();
            var _filename = $('#uploadContainer #fileupload input[type="file"]').val();
            this.controller.activeUpload =[$('#uploadContainer #fileupload'), new Date().getTime()];;
            
            window.app.groupCommand.addCommands(new ModelCommand(
                '/service/attachment/post/', 
                {
                    creator : _creator,
                    filename : _filename,
                    x : parseInt(_x),
                    y : parseInt(_y),
                    text : _text,
                    whiteboardid : this.whiteboard.id,
                    uid : this.controller.activeUpload[1]
                }
            ));
            this.hideDialog();
        }
    });
    return UploadDialog;
});
