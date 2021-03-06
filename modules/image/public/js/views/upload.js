define([
    'jquery',
    'underscore',
    'backbone',
    '/core/js/utils/model_command.js',
    '/core/js/views/dialogs/dialog.js',
    'text!/image/templates/upload.html'
], function($, _, Backbone, ModelCommand, Dialog, imageUploadDialogTemplate) {
    var ImageUploadDialog = Dialog.extend({
        initialize : function(options) {
            Dialog.prototype.initialize.apply( this );
            _.bindAll(this, 'showUploadDialog');
            window.app.eventDispatcher.bind("image:view_upload_dialog", this.showUploadDialog);
            this.controller = options.controller;
             $(this.el).attr("id","imageUploadContainer");
            
        },
        events : {
            'click button' : 'hideConfirmDialog',
            'change input[type="file"]':'fileChanged',
            'click #imageUpload input[type=submit]':'postImage'
        },
        render : function() {
            var data = {
                whiteboard : this.whiteboard,
                x : Math.floor(Math.random() * 700),
                y : Math.floor(Math.random() * 400),
                _ : _
            };
            var compiledTemplate = _.template(imageUploadDialogTemplate, data);
            $(this.el).html(compiledTemplate);
            $('#dialogs').html(this.el);
        },
        showUploadDialog : function(whiteboard) {
            this.whiteboard = whiteboard;
            this.showDialog();
        },
        hideConfirmDialog : function(evt) {
            evt.preventDefault();
            this.hideDialog();
        },
        fileChanged:function(){
            var input = $('#imageUploadContainer #imageUpload input[type="file"]');
            var filename = input.val();
            var fileExtensions = [".png",".jpg",".gif"];
            
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
        postImage : function(event) {
            event.preventDefault();

            var form = $('#imageUploadContainer #imageUpload'),
                file = form.find('input[type=file]');

            if(file.val() === '') {
                file.css('border','#ff0000 1px solid');
                return false;
            }

            this.controller.uploadImage(form);
            this.hideDialog();
        }
    });
    return ImageUploadDialog;
});
