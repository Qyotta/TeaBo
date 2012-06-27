define([
    'jquery', 
    'underscore', 
    'backbone', 
    '/core/js/utils/model_command.js',
    '/core/js/views/dialogs/dialog.js',
    'text!/settings/templates/userPreferencesDialog.html',
    '/core/js/views/notice/error.js',
    '/core/js/views/notice/notice.js',
], function($, _, Backbone, ModelCommand, Dialog, userPreferencesDialogTemplate,Error,Notice) {
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
        submited:function(e){
            e.preventDefault();
            
            var data = {
                firstname:$("#firstNameField",this.el).val(),
                email:$("#emailField",this.el).val(),
                lastname:$("#lastNameField",this.el).val(),
                position:$("#positionField",this.el).val(),
            }

            window.app.user.save(data, {success : function(){
                new Notice({message:"User preferences saved successfully."});
            }, 
            error : function(){
                new Error({message:"Error saving user preferences!"});
            }});
            this.hideDialog();
        },
        canceled:function(e){
            e.preventDefault();
            this.hideDialog();
        },
        render : function() {
            var data = {
                user : window.app.user
            };
            var compiledTemplate = _.template(userPreferencesDialogTemplate, data);
            $(this.el).empty();
            $(this.el).html(compiledTemplate);
            $('#dialogs').html(this.el);
            this.delegateEvents();
        },
        showPreferencesDialog : function() {
            this.showDialog();
        }
    });

    return UserPreferencesDialog;
});
