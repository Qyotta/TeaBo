define([
    'jquery',
    'underscore',
    'backbone',
    'core/views/dialogs/dialog',
    'text!templates/color_chooser/color_chooser_dialog.html'
], function($, _, Backbone, Dialog, colorChooserDialogTemplate){
    var ColorChooserDialogView = Dialog.extend({
        el:$('#dialogs'),
        initialize:function(){
            _.bindAll(this,'showColorChooserDialog');
            window.app.eventDispatcher.bind("topbar:choose_color",this.showColorChooserDialog);
            console.log('ColorChooserDialogView');
        },
        events:{
            'click #colorChooserContainer button.cancel' : 'hideColorChooserDialog',
        },
        render: function(data){
            var compiledTemplate = _.template( colorChooserDialogTemplate,data);
            this.el.html(compiledTemplate);
        },
        showColorChooserDialog:function(data){
            this.showDialog(data);
        },
        hideColorChooserDialog:function(evt){
            evt.preventDefault();
            this.hideDialog();
        },
    });
    return ColorChooserDialogView;
});