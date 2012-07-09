define([
    'jquery', 
    'underscore', 
    'backbone', 
    '/core/js/utils/model_command.js',
    '/core/js/views/dialogs/dialog.js',
    'text!/attachment/templates/upload.html'
], function($, _, Backbone, ModelCommand, Dialog, attachmentUploadDialogTemplate) {
    var AttachmentUploadDialog = Dialog.extend({
        constructor: function(){
            Dialog.prototype.constructor.apply( this, arguments );
        },
        initialize : function(options) {
            _.bindAll(this, 'showUploadDialog', 'postAttachment');
            window.app.eventDispatcher.bind("attachment:view_upload_dialog", this.showUploadDialog);
            this.controller = options.controller;
            $(this.el).attr("id","attachmentUploadContainer");
        },
        events : {
            'click button.cancel' : 'hideConfirmDialog',
            'change input[type="file"]':'fileChanged',
            'click #attachmentUpload input[type=submit]':'postAttachment',
        },
        render : function() {
            var data = {
                whiteboard : this.controller.whiteboard,
                x : Math.floor(Math.random() * 700),
                y : Math.floor(Math.random() * 400),
                _ : _,
            };
            var compiledTemplate = _.template(attachmentUploadDialogTemplate, data);
            $(this.el).html(compiledTemplate);
            $('#dialogs').html(this.el);
        },
        showUploadDialog : function() {
            console.log("show upload dialog");
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
            this.controller.generateUploadAttachment($('#attachmentUploadContainer #attachmentUpload'));
            this.hideDialog();
        }
    });
    return AttachmentUploadDialog;
});
