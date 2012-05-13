define([
    'jquery',
    'underscore',
    'backbone',
    'core/views/dialogs/dialog',
    'core/utils/util',
    'core/utils/model_command',
    'text!templates/color_chooser/color_chooser_dialog.html',
], function($, _, Backbone, Dialog, Utils,ModelCommand,colorChooserDialogTemplate){
    var ColorChooserDialogView = Dialog.extend({
        el:$('#dialogs'),
        initialize:function(){
            _.bindAll(this,'showColorChooserDialog');
            window.app.eventDispatcher.bind("topbar:choose_color",this.showColorChooserDialog);
            console.log('ColorChooserDialogView');
        },
        events:{
            'click #colorChooserContainer button.cancel' : 'hideColorChooserDialog',
            'click #colorChooserContainer button.save':'saveClicked',
            'click #colorChooserContainer > img' : 'colorChoosen'
        },
        render: function(){
            var color = this.color;
            var data = {
                   color : "rgb("+color[0]*100+"%,"+color[1]*100+"%,"+color[2]*100+"%)" 
            };
            var compiledTemplate = _.template( colorChooserDialogTemplate,data);
            this.el.html(compiledTemplate);
        },
        colorChoosen:function(e){
            console.log(e);
            var yPos = e.offsetY || e.pageY - $(e.target).offset().top;
            var rgb = Utils.hsvToRgb(yPos,50,100);
            this.color = [rgb[0]/255,rgb[1]/255,rgb[2]/255];
            this.render();
        },
        saveClicked:function(evt){
            var _color = this.color;
            var data = {
                    assignmentId : this.assignment.id,
                    color_r : Math.floor(_color[0]*255),
                    color_g : Math.floor(_color[1]*255),
                    color_b : Math.floor(_color[2]*255)
            };
            window.app.groupCommand.addCommands(
                    [new ModelCommand('/service/assignment/changeColor/',data)]);
            this.hideColorChooserDialog(evt);
        },
        showColorChooserDialog:function(data){
            this.assignment = data;
            this.color = this.assignment.get('color');
            this.showDialog();
        },
        hideColorChooserDialog:function(evt){
            evt.preventDefault();
            this.hideDialog();
        },
    });
    return ColorChooserDialogView;
});