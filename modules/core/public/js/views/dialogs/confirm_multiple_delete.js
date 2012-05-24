define([
    'jquery',
    'underscore',
    'backbone',
    '/core/js/views/dialogs/dialog.js',
    'text!/core/templates/dialogs/confirm_multiple_delete.html'
], function($, _, Backbone, Dialog, confirmDeleteTemplate){
   
    var ConfirmDeleteView = Dialog.extend({
        el:$('#dialogs'),
        showDialogFlag:"DeleteConfirmFlag",
        whiteboardId:0,
        initialize:function(){
            _.bindAll(this,'showConfirmDialog', 'confirmed', 'hideConfirmDialog', 'shouldShowDialog');
            window.app.eventDispatcher.bind("whiteboardItem:delete_multiple",this.showConfirmDialog);
        },
        events:{
            'click #confirmDeleteMultipleContainer button.cancel' : 'hideConfirmDialog',
            'click #confirmDeleteMultipleContainer input[type=submit]': 'confirmed'
        },
        render: function(){
            var compiledTemplate = _.template( confirmDeleteTemplate );
            this.el.html(compiledTemplate);
        },
        showConfirmDialog:function(wId){
            this.whiteboardId = wId;
            if(this.shouldShowDialog()){
                this.showDialog();
            }
            else {
                window.app.eventDispatcher.trigger('whiteboard:delete_multiple_items', this.whiteboardId);
            }
            
        },
        shouldShowDialog : function(){
            if(typeof window.app.user.get("settings").where(this.showDialogFlag)[0] == "undefined" || window.app.user.get("settings").where(this.showDialogFlag)[0].get("value") == "true" || window.app.user.get("settings").where(this.showDialogFlag)[0].get("value") == true){
                return true;
            } else {
                return false;
            }   
        },
        hideConfirmDialog:function(evt){
            evt.preventDefault();
            this.hideDialog();
        },
        confirmed:function(evt){
            evt.preventDefault();
            window.app.modules.userSettings.set(this.showDialogFlag,!$('#dialogs :checkbox').is(':checked'));
            this.hideDialog();
            window.app.eventDispatcher.trigger('whiteboard:delete_multiple_items', this.whiteboardId);
        }
    });    
    
    return ConfirmDeleteView;
});
