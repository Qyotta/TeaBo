define([
    'jquery',
    'underscore',
    'backbone',
    'core/views/dialogs/dialog',
    'text!templates/note/confirm_delete.html'
], function($, _, Backbone, Dialog, confirmDeleteTemplate){
    var ConfirmDeleteView = Dialog.extend({
        el:$('#dialogs'),
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
        	window.app.log('render confirm dialog');
            var compiledTemplate = _.template( confirmDeleteTemplate );
            this.el.html(compiledTemplate);
        },
        showConfirmDialog:function(model){
            this.model = model;
            if(this.shouldShowDialog){
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
            $.ajax({
                url: config.contextPath+"/user/setDeleteFlag.htm",
                type: 'POST',
                data: 'value='+!$('#dialogs :checkbox').is(':checked')
            });
            this.setFlag(!$('#dialogs :checkbox').is(':checked'));
            this.hideDialog();
            window.app.eventDispatcher.trigger('note:delete',this.model);
        },
        setFlag:function(value){
            window.app.log('show deleteConfirm:'+value);
            this.cDialog = value;
        }
    });    
    
    return ConfirmDeleteView;
});
