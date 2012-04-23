define([ 'jquery', 'underscore', 'backbone', 'core/views/dialogs/dialog',
        'text!templates/attachment/confirm_delete.html' ], function($, _,
        Backbone, Dialog, confirmDeleteTemplate) {
    var ConfirmDeleteView = Dialog
            .extend({
                el : $('#dialogs'),
                shouldShowDialog : true,
                initialize : function() {
                    _.bindAll(this, 'showConfirmDialog');
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
                    if (this.shouldShowDialog) {
                        this.showDialog();
                    } else {
                        window.app.eventDispatcher.trigger('attachment:delete',this.model);
                    }
                },
                hideConfirmDialog : function(evt) {
                    evt.preventDefault();
                    this.hideDialog();
                    this.model = null;
                },
                confirmed : function(evt) {
                    evt.preventDefault();
                    $.ajax({
                        url : config.contextPath + "/user/setDeleteFlag.htm",
                        type : 'POST',
                        data : 'value='
                                + !$('#dialogs :checkbox').is(':checked')
                    });
                    this.setFlag(!$('#dialogs :checkbox').is(':checked'));
                    this.hideDialog();
                    window.app.eventDispatcher.trigger('attachment:delete',this.model);
                },
                setFlag : function(value) {
                    window.app.log('[attachment] show deleteConfirm:' + value);
                    this.shouldShowDialog = value;
                }
            });

    return ConfirmDeleteView;
});
