define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/dialogs/logout.html'
], function($, _, Backbone, logoutDialogTemplate){
    function containerFadeIn(elem) {
        $('#dialogs div[id]').fadeOut(500,function() {
            if($(this).attr('id')==$(elem).attr('id')) $(elem).fadeIn();
        });
        $('.whiteboard').draggable('disable').css('cursor', 'default!important').css('background', 'url("../images/whiteboard-background-blured.gif")');
        $('.whiteboard .note, .whiteboard .attachment').draggable('disable').addClass('blurBox');
        $('.whiteboard .noteItems textarea').addClass('blurTextarea').attr('readonly', 'readonly').css('cursor', 'default');
        $('.whiteboard .noteItems textarea, .whiteboard .creator').addClass('blurText');
    }
    
    function containerFadeOut(elem) {
        $(elem).fadeOut();
        $('.whiteboard').draggable('enable').css('cursor', 'inherit').css('background', 'url("../images/whiteboard-background.gif")');
        $('.whiteboard .note, .whiteboard .attachment').draggable('enable').removeClass('blurBox');
        $('.whiteboard .noteItems textarea').removeClass('blurTextarea').removeAttr('readonly').css('cursor', 'inherit');
        $('.whiteboard .noteItems textarea, .whiteboard .creator').removeClass('blurText');
    }
    
    var LogoutDialogView = Backbone.View.extend({
        el:$('body'),
        events:{
            'click a[href="logout"]' : 'showLogoutDialog',
            'click #logoutContainer button.cancel' : 'hideLogoutDialog',
        },
        render: function(){
            var compiledTemplate = _.template( logoutDialogTemplate );
            $("#dialogs").html(compiledTemplate);
        },
        showLogoutDialog:function(evt){
            evt.preventDefault();
            containerFadeIn('#logoutContainer');
        },
        hideLogoutDialog:function(evt){
            evt.preventDefault();
            containerFadeOut('#logoutContainer');
        }
    });
    
    var initialize = function(){
        var logoutDialogView = new LogoutDialogView();
        logoutDialogView.render();
    };
    
    return {initialize: initialize};
});
