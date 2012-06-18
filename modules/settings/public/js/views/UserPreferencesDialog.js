define([
    'jquery', 
    'underscore', 
    'backbone', 
    '/core/js/utils/model_command.js',
    '/core/js/views/dialogs/dialog.js',
    'text!/settings/templates/userPreferencesDialog.html'
], function($, _, Backbone, ModelCommand, Dialog, userPreferencesDialogTemplate) {
    var UserPreferencesDialog = Dialog.extend({
        initialize : function(options) {
            _.bindAll(this, 'showPreferencesDialog');
            window.app.eventDispatcher.bind("settingsMenu:userPreferences", this.showPreferencesDialog);
        },
        events : {
        },
        render : function() {
            var data = {};
            var compiledTemplate = _.template(userPreferencesDialogTemplate, data);
            //$(this.el).html(compiledTemplate);
            //$('#dialogs').html(this.el);
        },
        showPreferencesDialog : function() {
            console.log("show user preferences dialog");
            //this.showDialog();
        },
        hideConfirmDialog : function(evt) {
            evt.preventDefault();
            this.hideDialog();
        }
    });

    return UserPreferencesDialog;
});
