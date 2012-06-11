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
            this.render(args);
            this.containerFadeIn();
        },
        hideDialog:function(){
            this.containerFadeOut(function(){
                $("#dialogs").css("display","none");
            });
        },
        containerFadeIn:function(callback) {
            // $('.whiteboard').draggable('disable').css('cursor', 'default!important').css('background', 'url("/images/whiteboard-background-blured.gif")');
            // $('.whiteboard *').draggable('disable').addClass('blurBox');
            // $('.whiteboard textarea, .whiteboard input').addClass('blurTextarea').attr('readonly', 'readonly').css('cursor', 'default');
            // $('.whiteboard textarea, .whiteboard .creator').addClass('blurText');
            $(this.el).fadeIn(500,callback);
        },
        containerFadeOut:function(callback) {
            $(this.el).fadeOut(500,callback);
            // $('.whiteboard').draggable('enable').css('cursor', 'inherit').css('background', 'url("/images/whiteboard-background.gif")');
            // $('.whiteboard *').draggable('enable').removeClass('blurBox');
            // $('.whiteboard * textarea').removeClass('blurTextarea').removeAttr('readonly').css('cursor', 'inherit');
            // $('.whiteboard * textarea, .whiteboard .creator').removeClass('blurText');
        }
    });
    
    return Dialog;
});
