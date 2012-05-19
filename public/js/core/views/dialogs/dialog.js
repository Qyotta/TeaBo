define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone,main){
    var Dialog = Backbone.View.extend({
        initialize:function(){
            window.app.log('initialize dialog');
        },
        render: function(args){
            var compiledTemplate = _.template( logoutDialogTemplate );
            this.el.html(compiledTemplate);
        },
        showDialog:function(args){
            this.render(args);
            this.containerFadeIn();
        },
        hideDialog:function(){
            this.containerFadeOut();
        },
        containerFadeIn:function(elem) {
            $('.whiteboard').draggable('disable').css('cursor', 'default!important').css('background', 'url("/images/whiteboard-background-blured.gif")');
            $('.whiteboard *').draggable('disable').addClass('blurBox');
            $('.whiteboard textarea, .whiteboard input').addClass('blurTextarea').attr('readonly', 'readonly').css('cursor', 'default');
            $('.whiteboard textarea, .whiteboard .creator').addClass('blurText');
            this.el.fadeIn(500);
        },
        containerFadeOut:function(elem) {
            this.el.fadeOut();
            $('.whiteboard').draggable('enable').css('cursor', 'inherit').css('background', 'url("/images/whiteboard-background.gif")');
            $('.whiteboard *').draggable('enable').removeClass('blurBox');
            $('.whiteboard * textarea').removeClass('blurTextarea').removeAttr('readonly').css('cursor', 'inherit');
            $('.whiteboard * textarea, .whiteboard .creator').removeClass('blurText');
        }
    });
    
    return Dialog;
});
