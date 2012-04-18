define(
        [ 'jquery', 'underscore', 'backbone', 'core/views/dialogs/dialog',
                'text!templates/attachment/upload_dialog.html' ],
        function($, _, Backbone, Dialog, uploadDialogTemplate) {
            var UploadDialog = Dialog
                    .extend({
                        el : $('#dialogs'),
                        initialize : function() {
                            _.bindAll(this, 'showUploadDialog');
                            window.app.eventDispatcher.bind(
                                    "attachment:view_upload_dialog",
                                    this.showUploadDialog);
                        },
                        events : {
                            'click #confirmDeleteNoteContainer button.cancel' : 'hideConfirmDialog',
                            'click #confirmDeleteNoteContainer input[type=submit]' : 'confirmed'
                        },
                        render : function() {
                            window.app.log('render upload dialog');
                            window.app.log(this.whiteboard);
                            var data = {
                                whiteboard : this.whiteboard,
                                _ : _,
                            };
                            var compiledTemplate = _.template(
                                    uploadDialogTemplate, data);
                            this.el.html(compiledTemplate);
                        },
                        showUploadDialog : function(whiteboard) {
                            window.app.log("showUploadDialog");
                            this.whiteboard = whiteboard;
                            this.showDialog();
                        },
                        hideConfirmDialog : function(evt) {
                            evt.preventDefault();
                            this.hideDialog();
                            this.model = null;
                        },
                        confirmed : function(evt) {
                            evt.preventDefault();
                            this.hideDialog();
                            window.app.eventDispatcher.trigger('note:delete',
                                    this.model);
                        }
                    });

            return UploadDialog;
        });
