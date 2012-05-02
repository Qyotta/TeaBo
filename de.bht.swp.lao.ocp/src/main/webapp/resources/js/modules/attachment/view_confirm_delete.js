define([ 'jquery', 'underscore', 'backbone', 'core/views/dialogs/dialog',
        'text!templates/modules/attachment/confirm_delete.html' ], function($, _,
        Backbone, Dialog, confirmDeleteTemplate) {
    var ConfirmDeleteView = Dialog
            .extend({
                el : $('#dialogs'),
                showDialogFlag:"DeleteConfirmFlag",
                initialize : function() {
                    _.bindAll(this, 'showConfirmDialog', 'confirmed', 'hideConfirmDialog', 'shouldShowDialog');
                    window.app.eventDispatcher.bind("attachment:delete_clicked",this.showConfirmDialog);
                },
                events : {
                    'click button.cancel' : 'hideConfirmDialog',
                    'click input[type=submit]' : 'confirmed'
                },
                render : function() {
                    var compiledTemplate = _.template(confirmDeleteTemplate);
                    this.el.html(compiledTemplate);
                },
                showConfirmDialog : function(model) {
                    this.model = model;
                    if(this.shouldShowDialog()){
                        this.showDialog();
                    } else {
                        window.app.eventDispatcher.trigger('attachment:delete',this.model);
                    }
                },
                shouldShowDialog : function(){
                    if(typeof window.app.user.get("settings").where(this.showDialogFlag)[0] == "undefined" || window.app.user.get("settings").where(this.showDialogFlag)[0].get("value") == "true"){
                        return true;
                    } else {
                        return false;
                    }   
                },
                hideConfirmDialog : function(evt) {
                    evt.preventDefault();
                    this.hideDialog();
                    this.model = null;
                },
                confirmed : function(evt) {
                    evt.preventDefault();
                    window.app.modules.userSettings.set(this.showDialogFlag,!$('#dialogs :checkbox').is(':checked'));
                    this.hideDialog();
                    window.app.eventDispatcher.trigger('attachment:delete',this.model);
                }
            });

    return ConfirmDeleteView;
});
