define([
    'jquery',
    'underscore',
    'backbone',
    '/core/js/views/notice/error.js',
    '/core/js/views/notice/notice.js',
    'text!/core/templates/forgotPassword.html'
], function($, _, Backbone, Error, Notice, forgotPasswordTemplate){
    var ForgotPasswordDialog = Backbone.View.extend({
        initialize:function(){
            this.render();
        },
        events:{
            'mousedown .registerCancelButtons button' : 'close',
            'submit form': 'accept',
            'keyup input#emailField' : 'validateEmailInput',
            'focusout input#emailField' : 'validateEmailInput'
        },
        render: function(){
            this.unrender();
            this.delegateEvents();
            
            $(this.el).addClass("forgotPasswordContainer");

            var data = {},
                compiledTemplate = _.template( forgotPasswordTemplate, data);

            this.el.innerHTML = compiledTemplate;
            $("#page").html(this.el);
        },
        unrender:function(){
            $('#page').empty();
        },
        close:function(e) {
            this.unrender();
            window.router.navigate("login", {trigger: true});
        },
        accept:function(e) {
            e.preventDefault();
            var email = $("#emailField").val();
            if(this.validateEmail(email)){
                $.ajax({
                    url: "user/forgotPassword",
                    type: 'post',
                    data: {email:email},
                    success: function(data) {
                        if(data.success){
                            new Notice({message:data.message});
                            window.router.navigate("login", {trigger: true});
                        }
                        else{
                            new Error({message:data.message});
                        }
                    }
                });
            }
        },
        validateEmailInput: function(e) {
            email = e.target.value;
            console.log(e.target);
            if(!this.validateEmail(email)) {
                $(e.target).addClass('error');
            } else {
                $(e.target).removeClass('error');
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
