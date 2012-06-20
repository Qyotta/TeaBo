define([
    'jquery',
    'underscore',
    'backbone',
    '/core/js/views/dialogs/dialog.js',
    'text!/attachment/templates/confirm_delete.html'
], function($, _, Backbone, Dialog, confirmDeleteTemplate){
   
    var ConfirmDeleteView = Dialog.extend({
        showDialogFlag:"DeleteConfirmFlag",
        initialize:function(){
            _.bindAll(this,'showConfirmDialog', 'confirmed', 'hideConfirmDialog', 'shouldShowDialog');
            window.app.eventDispatcher.bind("attachment:delete_clicked",this.showConfirmDialog);
        },
        events:{
            'click .dialogContainer button.cancel' : 'hideConfirmDialog',
            'click .dialogContainer input[type=submit]': 'confirmed'
        },
        render: function(){
            var compiledTemplate = _.template(confirmDeleteTemplate);
            $(this.el).attr('class','dialogContainer');
            $(this.el).html(compiledTemplate);
            $('#dialogs').html(this.el);
        },
        showConfirmDialog:function(model){
            this.model = model;
            if(this.shouldShowDialog()){
                this.showDialog();
            }
            else {
                window.app.eventDispatcher.trigger('whiteboardItem:delete',this.model);
                window.app.eventDispatcher.trigger('attachment:delete',this.model);
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
            this.model = null;
        },
        confirmed:function(evt){
            evt.preventDefault();
            window.app.modules.settings.set(this.showDialogFlag,!$('#dialogs :checkbox').is(':checked'));
            this.hideDialog();
            window.app.eventDispatcher.trigger('attachment:delete',this.model);
            window.app.eventDispatcher.trigger('whiteboardItem:delete',this.model);
        }
    });    
    
    return ConfirmDeleteView;
});
