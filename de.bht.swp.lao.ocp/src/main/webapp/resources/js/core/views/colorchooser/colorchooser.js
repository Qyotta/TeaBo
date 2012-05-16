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
            _.bindAll(this,'showColorChooserDialog','saveClicked','setHexValue');
            window.app.eventDispatcher.bind("topbar:choose_color",this.showColorChooserDialog);
            this.menu      = $('div.left > div.invite > div');
            this.lastValue = 0;
        },
        events:{
            'click a.accept':'saveClicked',
            'click a.close':'hideColorChooserDialog',
            'click #colorChooserContainer > img' : 'colorChoosen',
            // 'keydown input.rgb' : 'checkInputValue',
            // 'keyup input.rgb' : 'setHexValue'
        },
        render: function(){
            var color = this.color,
                r     = Math.floor(color[0]*100),
                g     = Math.floor(color[1]*100),
                b     = Math.floor(color[2]*100);
                hex   = "#"+this.RGBtoHEX(r)+this.RGBtoHEX(g)+this.RGBtoHEX(b);
            var data = {
                   color : "rgb("+r+"%,"+g+"%,"+b+"%)",
                   r:r,
                   g:g,
                   b:b,
                   hex:hex
            };
            var compiledTemplate = _.template( colorChooserDialogTemplate,data);
            this.el.html(compiledTemplate);
        },
        colorChoosen:function(e){
            var yPos = e.offsetY || e.pageY - $(e.target).offset().top;
            var xPos = e.offsetX || e.pageX - $(e.target).offset().left;
            var s = 1;
            var v = 1;
            if(yPos>90){
                v = 1-((yPos-90)/180);
            }else{
                s = (yPos/180)+0.2;
            }
            
            var h = xPos/180;
            var rgb = Utils.hsvToRgb(h*360,s*100,v*100);
            this.color = [rgb[0]/255,rgb[1]/255,rgb[2]/255];
            this.render();
        },
        saveClicked:function(evt){
            evt.preventDefault();
            var _color = this.color;
            var data = {
                    assignmentId : this.assignment.id,
                    color_r : Math.floor(_color[0]*255),
                    color_g : Math.floor(_color[1]*255),
                    color_b : Math.floor(_color[2]*255)
            };
            window.app.groupCommand.addCommands(new ModelCommand('/service/assignment/changeColor/',data));
            this.hideColorChooserDialog(evt);
        },
        showColorChooserDialog:function(data){
            this.assignment = data;
            this.color = this.assignment.get('color');
            $('div.left > div.invite > div').css('display','block');
            this.showDialog();
        },
        hideColorChooserDialog:function(evt){
            evt.preventDefault();
            this.hideDialog();
            $('div.left > div.invite > div').removeAttr('style');
        },
        RGBtoHEX: function(rgb) {
            if (rgb == null) {
                return "00";
            }
            rgb = parseInt(rgb); 
            if (rgb == 0 || isNaN(rgb)) {
                return "00";
            }
            rgb = Math.max(0 , rgb); 
            rgb = Math.min(rgb , 255); 
            rgb = Math.round(rgb);
            return "0123456789ABCDEF".charAt((rgb-rgb%16)/16) + "0123456789ABCDEF".charAt(rgb%16);
        },
        checkInputValue:function(e) {
            var key   = window.event ? e.keyCode : e.which,
                value = e.target.value;

            if (e.keyCode == 8 || e.keyCode == 46 || e.keyCode == 37 || e.keyCode == 39) {
                return true;
            }
            else if ( key < 48 || key > 57 ) {
                return false;
            }
            else {
                return true;
            }
        },
        setHexValue: function(e) {
            var value = e.target.value,
                hex   = "",
                that  = this;
            if(value > 100) {
                e.target.value = this.lastValue;
                return false;
            }
            this.lastValue = value;
            $.each(this.el.find('input.rgb'),function(i, el) {
                hex += that.RGBtoHEX(el.value);
            });
            if($(e.target).attr('name') === 'color_r') {
                this.color[0] = value/255;
            } else if($(e.target).attr('name') === 'color_g') {
                this.color[1] = value/255;
            } else {
                this.color[2] = value/255;
            }
            this.el.find('input.hex').val('#'+hex);
            this.el.find('> div > div > div').css('background','#'+hex);
        }
    });
    return ColorChooserDialogView;
});