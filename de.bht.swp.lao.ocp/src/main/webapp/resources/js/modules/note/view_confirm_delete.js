define([
    'jquery',
    'underscore',
    'backbone',
    'core/views/dialogs/dialog',
    'text!templates/note/confirm_delete.html'
], function($, _, Backbone, Dialog, confirmDeleteTemplate){
    var ConfirmDeleteView = Dialog.extend({
        el:$('#dialogs'),
        showDialog:true,
        initialize:function(){
            _.bindAll(this,'showConfirmDialog');
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
            if(this.showDialog){
                this.model = model;
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
                data: 'value='+!$('input[name="confirm-delete"]').is(':checked')
            });
            this.hideDialog();
            window.app.eventDispatcher.trigger('note:delete',this.model);
        },
        setFlag:function(value){
            this.showDialog = value;
        }
    });    
    
    return ConfirmDeleteView;
});
