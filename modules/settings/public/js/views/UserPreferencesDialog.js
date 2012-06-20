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
             $(this.el).attr("id","userPreferencesDialog");
            
        },
        events : {
            'click button.cancel' : 'canceled',
            'click input[type=submit]': 'submited'
        },
        submited:function(){
            
        },
        canceled:function(e){
            e.preventDefault();
            this.hideDialog();
        },
        render : function() {
            var data = {};
            var compiledTemplate = _.template(userPreferencesDialogTemplate, data);
            $(this.el).html(compiledTemplate);
            $('#dialogs').html(this.el);
            this.delegateEvents();
        },
        showPreferencesDialog : function() {
            console.log("show user preferences dialog");
            this.showDialog();
        }
    });

    return UserPreferencesDialog;
});
