define([
    'jquery', 
    'underscore', 
    'backbone', 
    '/core/js/utils/model_command.js',
    '/core/js/views/dialogs/dialog.js',
    'text!/settings/templates/changePasswordDialog.html'
], function($, _, Backbone, ModelCommand, Dialog, changePasswordDialogTemplate) {
    var ChangePasswordDialog = Dialog.extend({
        initialize : function(options) {
            _.bindAll(this, 'showChangePasswordDialog');
            window.app.eventDispatcher.bind("settingsMenu:changePassword", this.showChangePasswordDialog);
            $(this.el).attr("id","changePasswordDialog");            
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
            var compiledTemplate = _.template(changePasswordDialogTemplate, data);
            $(this.el).html(compiledTemplate);
            $('#dialogs').html(this.el);
            this.delegateEvents();
        },
        showChangePasswordDialog : function() {
            console.log("show change password dialog");
            $('.lightbox').hide();
            this.showDialog();
        }
    });

    return ChangePasswordDialog;
});
