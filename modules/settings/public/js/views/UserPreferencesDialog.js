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
            'click input[type=submit]': 'submited',
            'hover .exclamation' : 'showError',
            'keyup #emailField' : 'validateEmailInput'
        },
        submited:function(e){
            e.preventDefault();
            
            this.errors = this.validateInput();
            
            if(this.errors){
                this.render();
                return;
            };

            var data = {
                firstname:$("#firstNameField",this.el).val(),
                email:$("#emailField",this.el).val(),
                lastname:$("#lastNameField",this.el).val(),
                position:$("#positionField",this.el).val(),
            }

            window.app.user.set(data);
            window.app.user.save(null, {success : function(){
                new Notice({message:"User preferences saved successfully."});
            }, 
            error : function(){
                new Error({message:"Error saving user preferences!"});

            }});
            this.hideDialog();
        },
        validateInput:function(e){
            var errors = null;
            var email = $('#emailField').val();
            if(!this.validateEmail(email)){
                errors = errors || {};
                errors.email = "Enter a valid email.";
            }
            return errors;
        },
         validateEmail:function(email){
            // matches <anystring>@<anystring>.<anystring>
            // the length of the last part gets unrelevant in near future because of the new TLD e.g. *.hamburg etc.
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        },
        validateEmailInput: function(e) {
            email = e.target.value;
            
            if(!this.validateEmail(email)) {
                $(e.target).addClass('error');
            } else {
                $(e.target).removeClass('error');
            }
        },
        canceled:function(e){
            e.preventDefault();
            this.hideDialog();
        },
        render : function() {
            var data = {
                user : window.app.user,
                errors:this.errors
            };
            var compiledTemplate = _.template(userPreferencesDialogTemplate, data);
            $(this.el).html(compiledTemplate);
            $('#dialogs').html(this.el);
            this.delegateEvents();   
        },
        showPreferencesDialog : function() {
            console.log("show user preferences dialog");
            $('.lightbox').hide();
            this.showDialog();
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

    return UserPreferencesDialog;
});
