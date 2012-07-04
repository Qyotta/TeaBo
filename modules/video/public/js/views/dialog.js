define([
    'jquery', 
    'underscore', 
    'backbone',
    '/core/js/views/dialogs/dialog.js',
    'text!/video/templates/dialog.html'
], function($, _, Backbone, Dialog, videoDialogTemplate) {
    var VideoDialog = Dialog.extend({
        initialize : function(options) {
            _.bindAll(this, 'showVideoDialog');
            
        },
        events : {

        },
        render : function() {
            var data = {
            };
            var compiledTemplate = _.template(imageUploadDialogTemplate, data);
            $(this.el).html(compiledTemplate);
            $('#dialogs').html(this.el);
        },
        showVideoDialog : function() {
            evt.preventDefault();
            this.showDialog();
        },
        hideVideoDialog : function(evt) {
            evt.preventDefault();
            this.hideDialog();
        }
    });
    return VideoDialog;
});
