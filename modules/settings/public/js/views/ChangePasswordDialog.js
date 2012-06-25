define([
    'jquery', 
    'underscore', 
    'backbone', 
    '/core/js/utils/model_command.js',
    '/core/js/views/dialogs/dialog.js',
    'text!/settings/templates/changePasswordDialog.html',
    '/core/js/views/notice/error.js',
    '/core/js/views/notice/notice.js',
], function($, _, Backbone, ModelCommand, Dialog, changePasswordDialogTemplate, Error, Notice) {
    var ChangePasswordDialog = Dialog.extend({
        initialize : function(options) {
            _.bindAll(this, 'showChangePasswordDialog');
            window.app.eventDispatcher.bind("settingsMenu:changePassword", this.showChangePasswordDialog);
        },
        events : {
            'click button.cancel' : 'canceled',
            'click input[type=submit]': 'submited',
            'hover .exclamation' : 'showError'
        },
        render : function() {
            var data = {errors:this.errors};
            var compiledTemplate = _.template(changePasswordDialogTemplate, data);
            $(this.el).html(compiledTemplate);
            $('#dialogs').html(this.el);
            this.delegateEvents();
        },
        submited:function(e){
            e.preventDefault();
            
            this.errors = this.validateInput();
            
            if(this.errors){
                this.render();
                return;
            }
            
            var newpassword = $(this.el).find('#newpw').val();
            window.app.user.set({password : newpassword});
            window.app.user.save(null, {success : function(){
                new Notice({message:"User password saved successfully."});
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
        showChangePasswordDialog : function() {
            this.showDialog();
        },
        validateInput:function(){
            var errors = null;
            
            var newpassword = $(this.el).find('#newpw').val();
            var confirmpassword = $(this.el).find('#confirmpw').val();
            var oldpassword = $(this.el).find('#oldpw').val();
            
            var newpass_len = newpassword.length;
            var confirmpass_len = confirmpassword.length;   
            
            if(window.app.user.get("password") != oldpassword){
                errors = errors || {};
                errors.oldpw = "Password was not correct!";
            }
            
            if(newpass_len<6){
                errors = errors || {};
                errors.newpw = "Password too short. Minimum length is 6.";
            }
            
            if(confirmpass_len<6){
                errors = errors || {};
                errors.confirmpw = "Password too short. Minimum length is 6.";
            }
            
            if(newpassword != confirmpassword){
                errors = errors || {};
                errors.confirmpw = "Please verify your passwords.";
            }

            return errors;
        },
        showError:function(e) {
            var errors = $(e.currentTarget).find('div.errors');

            if(e.type === 'mouseenter') {
                errors.show();
            } else {
                errors.hide();
            }
        }
    });

    return ChangePasswordDialog;
});
