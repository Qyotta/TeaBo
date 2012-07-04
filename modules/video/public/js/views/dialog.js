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
            this.controller = options.controller;
        },
        events : {
            'click button.cancel' : 'hideVideoDialog'
        },
        render : function() {
            var data = {};
            var compiledTemplate = _.template(videoDialogTemplate, data);

            $(this.el).html(compiledTemplate);
            $('#dialogs').html(this.el);
            this.delegateEvents();
        },
        showVideoDialog : function() {
            this.showDialog();
        },
        hideVideoDialog : function(evt) {
            evt.preventDefault();
            this.hideDialog();
        }
    });
    return VideoDialog;
});
