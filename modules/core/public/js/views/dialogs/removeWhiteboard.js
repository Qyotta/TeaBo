define([
    'jquery',
    'underscore',
    'backbone',
    '/core/js/views/dialogs/dialog.js',
    'text!/core/templates/dialogs/removeWhiteboard.html'
], function($, _, Backbone, Dialog, removeWhiteboardDialogTemplate){
    var RemoveWhiteboardDialogView = Dialog.extend({
        initialize:function(){
            _.bindAll(this,'showThisDialog','removeWhiteboard');
            window.app.eventDispatcher.bind("whiteboard:openRemoveDialog",this.showThisDialog);
             $(this.el).attr("id","removeWhiteboardContainer");

            this.whiteboardID = undefined;
        },
        events:{
            'click button.cancel' : 'hideDialog',
            'click input[type=submit]': 'removeWhiteboard'
        },
        render: function(){
            $('#dialogs').empty();
            this.delegateEvents();
            var compiledTemplate = _.template(removeWhiteboardDialogTemplate);
            $(this.el).html(compiledTemplate);
            $('#dialogs').html(this.el);
        },
        showThisDialog:function(id){
            this.whiteboardID = id;
            this.showDialog();
        },
        removeWhiteboard:function(e) {
            e.preventDefault();
            window.app.eventDispatcher.trigger('whiteboard:remove',this.whiteboardID);
            this.hideDialog();
        },
    });
    return RemoveWhiteboardDialogView;
});
