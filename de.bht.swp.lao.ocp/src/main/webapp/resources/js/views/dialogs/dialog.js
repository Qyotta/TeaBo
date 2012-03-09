define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone,main){
    var Dialog = Backbone.View.extend({
        el:$('#dialogs'),
		initialize:function(){
			window.app.log('initialize dialog');
		},
        render: function(){
            var compiledTemplate = _.template( logoutDialogTemplate );
            this.el.html(compiledTemplate);
        },
		showDialog:function(){
			this.containerFadeIn('#dialogs');
		},
		hideDialog:function(){
			this.containerFadeOut('#dialogs');
        },
		containerFadeIn:function(elem) {
			$('#dialogs div[id]').fadeOut(500,function() {
				if($(this).attr('id')==$(elem).attr('id')) $(elem).fadeIn();
			});
			$('.whiteboard').draggable('disable').css('cursor', 'default!important').css('background', 'url("../images/whiteboard-background-blured.gif")');
			$('.whiteboard .note, .whiteboard .attachment').draggable('disable').addClass('blurBox');
			$('.whiteboard .noteItems textarea').addClass('blurTextarea').attr('readonly', 'readonly').css('cursor', 'default');
			$('.whiteboard .noteItems textarea, .whiteboard .creator').addClass('blurText');
		},
		containerFadeOut:function(elem) {
			$(elem).fadeOut();
			$('.whiteboard').draggable('enable').css('cursor', 'inherit').css('background', 'url("../images/whiteboard-background.gif")');
			$('.whiteboard .note, .whiteboard .attachment').draggable('enable').removeClass('blurBox');
			$('.whiteboard .noteItems textarea').removeClass('blurTextarea').removeAttr('readonly').css('cursor', 'inherit');
			$('.whiteboard .noteItems textarea, .whiteboard .creator').removeClass('blurText');
		}
    });
	
    return Dialog;
});
