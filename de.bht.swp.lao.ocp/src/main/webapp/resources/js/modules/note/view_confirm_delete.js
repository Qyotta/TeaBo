define([
    'jquery',
    'underscore',
    'backbone',
    'core/views/dialogs/dialog',
    'text!templates/note/confirm_delete.html'
], function($, _, Backbone, Dialog, confirmDeleteTemplate){
   
    var ConfirmDeleteView = Dialog.extend({
        el:$('#dialogs'),
        showDialogFlag:"DeleteConfirmFlag",
        shouldShowDialog:true,
        initialize:function(){
            _.bindAll(this,'showConfirmDialog', 'confirmed', 'hideConfirmDialog');
            window.app.eventDispatcher.bind("note:delete_clicked",this.showConfirmDialog);
        },
        events:{
            'click #confirmDeleteNoteContainer button.cancel' : 'hideConfirmDialog',
            'click #confirmDeleteNoteContainer input[type=submit]': 'confirmed'
        },
        render: function(){
            var compiledTemplate = _.template( confirmDeleteTemplate );
            this.el.html(compiledTemplate);
        },
        showConfirmDialog:function(model){
            this.model = model;
            if(window.app.user.get("settings").where(this.showDialogFlag)[0].get("value") == true){
                this.showDialog();
            }
            else {
                window.app.eventDispatcher.trigger('note:delete',this.model);
            }
        	
        },
        hideConfirmDialog:function(evt){
            evt.preventDefault();
            this.hideDialog();
            this.model = null;
        },
        confirmed:function(evt){
            evt.preventDefault();
            window.app.modules.userSettings.set(this.showDialogFlag,!$('#dialogs :checkbox').is(':checked'));
            this.hideDialog();
            window.app.eventDispatcher.trigger('note:delete',this.model);
        }
    });    
    
    return ConfirmDeleteView;
});
