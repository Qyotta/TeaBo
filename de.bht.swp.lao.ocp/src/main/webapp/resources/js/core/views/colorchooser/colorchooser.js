define([
    'jquery',
    'underscore',
    'backbone',
    'core/views/dialogs/dialog',
    'core/utils/util',
    'text!templates/color_chooser/color_chooser_dialog.html'
], function($, _, Backbone, Dialog, Utils,colorChooserDialogTemplate){
    var ColorChooserDialogView = Dialog.extend({
        el:$('#dialogs'),
        initialize:function(){
            _.bindAll(this,'showColorChooserDialog');
            window.app.eventDispatcher.bind("topbar:choose_color",this.showColorChooserDialog);
            console.log('ColorChooserDialogView');
        },
        events:{
            'click #colorChooserContainer button.cancel' : 'hideColorChooserDialog',
            'click .colorRangeContainer img' : 'colorChoosen'
        },
        render: function(data){
            var compiledTemplate = _.template( colorChooserDialogTemplate,data);
            this.el.html(compiledTemplate);
        },
        colorChoosen:function(e){
            var rgb = Utils.hsvToRgb(e.offsetY,50,100);
            var _rgb = "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
            this.render({color:_rgb});
//            new ModelCommand();
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