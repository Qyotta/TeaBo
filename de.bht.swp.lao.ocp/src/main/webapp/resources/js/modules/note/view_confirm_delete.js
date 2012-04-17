define([
    'jquery',
    'underscore',
    'backbone',
    'core/views/dialogs/dialog',
    'text!templates/note/confirm_delete.html'
], function($, _, Backbone, Dialog, confirmDeleteTemplate){
    var ConfirmDeleteView = Dialog.extend({
        el:$('#dialogs'),
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
        	this.model = model;
            this.showDialog();
        },
        hideConfirmDialog:function(evt){
            evt.preventDefault();
            this.hideDialog();
            this.model = null;
        },
        confirmed:function(evt){
            evt.preventDefault();
            this.hideDialog();
            window.app.eventDispatcher.trigger('note:delete',this.model);
        }
    });    
    
    return ConfirmDeleteView;
});
