define([
    'jquery', 
    'underscore', 
    'backbone', 
    '/core/js/utils/model_command.js',
    '/core/js/views/dialogs/dialog.js',
    'text!/attachment/templates/upload.html'
], function($, _, Backbone, ModelCommand, Dialog, attachmentUploadDialogTemplate) {
    var AttachmentUploadDialog = Dialog.extend({
        initialize : function(options) {
            _.bindAll(this, 'showUploadDialog', 'postAttachment');
            window.app.eventDispatcher.bind("attachment:view_upload_dialog", this.showUploadDialog);
            this.controller = options.controller;
        },
        events : {
            'click #attachmentUploadContainer button.cancel' : 'hideConfirmDialog',
            'change #attachmentUploadContainer input[type="file"]':'fileChanged',
            'click #attachmentUploadContainer #attachmenUpload input[type=submit]':'postAttachment',
        },
        render : function() {
            var data = {
                whiteboard : this.whiteboard,
                x : Math.floor(Math.random() * 700),
                y : Math.floor(Math.random() * 400),
                _ : _,
            };
            var compiledTemplate = _.template(attachmentUploadDialogTemplate, data);
            $(this.el).html(compiledTemplate);
            $('#dialogs').html(this.el);
        },
        showUploadDialog : function(whiteboard) {
            console.log("show upload dialog");
            this.whiteboard = whiteboard;
            this.showDialog();
        },
        hideConfirmDialog : function(evt) {
            evt.preventDefault();
            this.hideDialog();
        },
        fileChanged:function(){
            var input = $('#attachmentUploadContainer #attachmentUpload input[type="file"]');
            var filename = input.val();
            var fileExtensions = ['.pdf', '.doc', 'docx', '.xls', '.ppt', '.pptx', '.odp', '.odf'];
            
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
        postAttachment : function(event) {
            event.preventDefault();
            this.controller.uploadAttachment($('#attachmentUploadContainer #attachmentUpload'));
            this.hideDialog();
        }
    });
    return AttachmentUploadDialog;
});
