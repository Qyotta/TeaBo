define([
    'jquery',
    'underscore',
    'backbone',
    '/core/js/views/dialogs/dialog.js',
    '/core/js/views/notice/error.js',
    '/core/js/views/notice/notice.js',
    'text!/core/templates/dialogs/forgotPasswordDialog.html'
], function($, _, Backbone, Dialog, Error, Notice, forgotPasswordDialogTemplate){
    var ForgotPasswordDialog = Dialog.extend({
        initialize:function(){
             $(this.el).attr("id","forgotPasswordContainer");
        },
        events:{
            'click a.close' : 'close',
            'click a.accept': 'accept'
        },
        render: function(){
            $('#dialogs').empty();
            this.delegateEvents();
            var compiledTemplate = _.template(forgotPasswordDialogTemplate);
            $(this.el).html(compiledTemplate);
            $('#dialogs').html(this.el);
        },
        close:function(e) {
            e.preventDefault();
            this.hideDialog();
        },
        accept:function(e) {
            e.preventDefault();
            this.hideDialog();
            var email = $("#emailField").val();
            if(this.validateEmail(email)){
                $.ajax({
                    url: "user/forgotPassword",
                    type: 'post',
                    data: {email:email},
                    success: function(data) {
                        if(data.success){
                            new Notice({message:data.message});
                        }
                        else{
                            new Error({message:data.message});
                        }
                    }
                });
            }
        },
        validateEmail:function(email){
            // matches <anystring>@<anystring>.<anystring>
            // the length of the last part gets unrelevant in near future because of the new TLD e.g. *.hamburg etc.
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        }
    });
    return ForgotPasswordDialog;
});
