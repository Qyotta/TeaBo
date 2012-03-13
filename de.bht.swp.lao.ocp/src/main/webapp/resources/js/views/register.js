define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/register.html',
    'views/notice/notice',
    'views/notice/error',
], function($, _, Backbone,registerTemplate,Notice,Error){
    var RegisterView = Backbone.View.extend({
        el: $("#page"),
        events:{
            'click .registerCancelButtons input[type=submit]' : 'submitClicked',
            'click .registerCancelButtons button' : 'cancelClicked',
        },
        initialize:function(){
            this.render();
        },
        render:function(){
            var data = {email:this.email,firstname:this.firstname,lastname:this.lastname,position:this.position,errors:this.errors};
            var compiledTemplate = _.template( registerTemplate , data);
            this.el.html(compiledTemplate);
        },
        submitClicked:function(evt){
            evt.preventDefault();
            
            this.firstname = $('input[name=firstname]').val();
            this.lastname = $('input[name=lastname]').val();
            this.position = $('input[name=position]').val();
            
            this.email = $('input[name=email]').val();
            this.password = $('input[name=password]').val();
            this.passwordvalidate = $('input[name=passwordvalidate]').val();
            
            this.errors = this.validateInput();
            
            if(this.errors){
                this.render();
                return;
            }
            
            window.app.user.save({email:this.email,
                                password:this.password,
                                firstname:this.firstname,
                                lastname:this.lastname,
                                position:this.position},
                                {success:function(model, response){
                                    window.app.router.navigate("main",{trigger: true});
                                    new Notice({message:"Registration was successful. Please login with your credentials."});
                                },error:function(model, response){
                                     new Error({message:"Registration was not successful. Try again."});
                                }});
        },
        validateInput:function(){
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
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        },
        cancelClicked:function(evt){
            evt.preventDefault();
            window.app.router.navigate("main", {trigger: true});
        },
    });
    
    return RegisterView;
});