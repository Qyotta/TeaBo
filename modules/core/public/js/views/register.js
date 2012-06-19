define([
    'jquery',
    'underscore',
    'backbone',
    '/user/js/model/user.js',
    'text!/core/templates/register.html',
    '/core/js/views/notice/notice.js',
    '/core/js/views/notice/error.js'
], function($, _, Backbone, User,registerTemplate,Notice,Error){
    var RegisterView = Backbone.View.extend({
        el: $("#page"),
        events:{
            'submit form[name="register"]' : 'submitClicked',
            'mousedown .registerCancelButtons button' : 'cancelClicked',
            'hover .exclamation' : 'showError',
            'keyup input[name="email"]' : 'validateEmailInput'
        },
        initialize:function(){
            this.registerInProgress = false;
            this.render();
        },
        render:function(){
            this.registerInProgress = false;
            var data = {email:this.email,firstname:this.firstname,lastname:this.lastname,position:this.position,errors:this.errors};
            var compiledTemplate = _.template( registerTemplate , data);
            this.el.html(compiledTemplate);
        },
        unrender:function(){
            this.el.html('');
        },
        submitClicked:function(evt){
            evt.preventDefault();
            this.firstname = $('input[name=firstname]').val();
            this.lastname = $('input[name=lastname]').val();
            this.position = $('input[name=position]').val();
            
            this.email = $('input[name=email]').val();
            this.password = $('input[name=password]').val();
            this.passwordvalidate = $('input[name=passwordvalidate]').val();
            
            // prevent double submit
            // TODO find better solution for this case
            if(this.registerInProgress) {
                return;
            }
            this.registerInProgress = true;

            this.errors = this.validateInput();
            
            if(this.errors){
                this.render();
                return;
            }

            var self = this;
            this.user = new User();
            this.user.save({
                email:this.email,
                password:this.password,
                firstname:this.firstname,
                lastname:this.lastname,
                position:this.position},
                {success:function(model, response){
                    console.log('register this user');
                    if(response) {
                        window.app.user.set(response);
                        window.router.loggedIn();

                        self.unrender();

                        window.router.navigate("main",{trigger: true});
                        new Notice({message:"Registration was successful. You're now logged in!"});
                    } else {
                        new Error({message:"An user with this email address is already registered!"});
                    }
                },error:function(model, response){
                     new Error({message:"Registration was not successful. Try again."});
                }
            });
        },
        validateInput:function(e){
            var errors = null;
            
            var pass_len = this.password.length;
            
            if(!this.validateEmail(this.email)){
                errors = errors || {};
                errors.email = "Enter a valid email.";
            }
            
            if(pass_len<6){
                errors = errors || {};
                errors.password = "Password too short. Minimum length is 6.";
            }
            
            if(this.password != this.passwordvalidate){
                errors = errors || {};
                errors.verify = "Please verify your passwords.";
            }

            return errors;
        },
        validateEmail:function(email){
            // matches <anystring>@<anystring>.<anystring>
            // the length of the last part gets unrelevant in near future because of the new TLD e.g. *.hamburg etc.
            var re = /\S+@\S+\.\S+/;
            return re.test(email);
        },
        cancelClicked:function(e){
            e.preventDefault();
            window.router.navigate("login", {trigger: true});
        },
        showError:function(e) {
            var errors = $(e.currentTarget).find('div.errors');

            if(e.type === 'mouseenter') {
                errors.show();
            } else {
                errors.hide();
            }
        },
        validateEmailInput: function(e) {
            email = e.target.value;

            if(!this.validateEmail(email)) {
                $(e.target).addClass('error');
            } else {
                $(e.target).removeClass('error');
            }
        }
    });
    
    return RegisterView;
});
