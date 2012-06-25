define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone,main){
    var Dialog = Backbone.View.extend({
        initialize:function(){
            window.app.log('initialize dialog');
        },

        showDialog:function(args){
            $("#dialogs").css("display","block");
            $(this.el).addClass("dialog");
            this.render(args);
            this.containerFadeIn();
        },

        hideDialog:function(){
            this.containerFadeOut(function(){
                $("#dialogs").css("display","none");
            });
        },

        containerFadeIn:function(callback) {
            $('body, .whiteboard').css('background', 'url("/images/whiteboard-background-blured.gif")');
            $('.whiteboard *').addClass('blurBox');
            $('.whiteboard textarea, .whiteboard input, .mainPanel form input').addClass('blurTextarea').attr('readonly', 'readonly');
            $('.whiteboard textarea, .whiteboard .creator').addClass('blurText');
            $(this.el).fadeIn(500,callback);            
            $('.mainPanel').addClass('mainPanelBlur');
            
        },

        containerFadeOut:function(callback) {

            $('.whiteboard').css('background', 'url("/images/whiteboard-background.gif")');
            $('.whiteboard *').removeClass('blurBox');
            $('.whiteboard * textarea, .mainPanel form input').removeClass('blurTextarea').removeAttr('readonly');
            $('.whiteboard * textarea, .whiteboard .creator').removeClass('blurText');
            $(this.el).fadeOut(500,callback);
            $('.mainPanel').removeClass('mainPanelBlur');
            $('body').css('background', 'url("/whiteboard/images/background.gif") repeat scroll 0 0 transparent');
        }
    });
    
    return Dialog;
});
