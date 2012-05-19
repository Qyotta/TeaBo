define([ 'jquery', 
         'underscore', 
         'backbone', 
         'core/views/whiteboarditem',
         'core/modus',
         'text!templates/modules/attachment/attachment.html', ],
         function($, _, Backbone, WhiteboardItemView,WhiteboardModus, attachmentTemplate) {
    var AttachmentView = WhiteboardItemView.extend({
        name : 'attachment',
        events : {
            'dblclick .attachmentItems' : 'downloadFile',
            'click .attachmentItems' : 'isClicked',
        },
        constructor: function(){
            this.events = _.extend( {}, WhiteboardItemView.prototype.events, this.events );
            WhiteboardItemView.prototype.constructor.apply( this, arguments );
         },
        initialize : function(options) {
            WhiteboardItemView.prototype.initialize.apply( this );
            _.bindAll(this,'changed');
            this.controller = options.controller;
            this.model.bind('change',this.changed,this);

            $(this.el).attr("id", "attachment-"+this.model.id);
            $(this.el).addClass("whiteboarditem attachment draggable hoverable");
            $(this.el).css('position', 'absolute');
            
            this.render();
        },
        changed:function(){
            this.render();
        },
        render : function() {
            var filename = this.model.get('filename');
            var ext = filename.split('.').pop(),
            shortName = filename.substr(0, filename.length - (ext.length + 1)),
            
            imgPath = config.contextPath+"/images/teambox-free-file-icons/32px/"+ext+".png";
            
            if(!this.model.isComplete()){
                if (this.controller.activeUpload != null && this.model.get('uid') === this.controller.activeUpload[1]){
                    imgPath = config.contextPath+"/images/loading.gif";
                } else {
                    imgPath = config.contextPath+"/images/stop.gif";
                }
            }
            
            this.model.set({image : imgPath,shortName:shortName});
            
            var data = {
                attachment : this.model,
                _ : _
            };

            var compiledTemplate = _.template(attachmentTemplate, data);
            
            if ($("#attachment-" + this.model.id).length > 0) {
                $("#attachment-" + this.model.id).css('left', this.model.get('x') + 'px');
                $("#attachment-" + this.model.id).css('top', this.model.get('y') + 'px');
                $("#attachment-" + this.model.id).html(compiledTemplate);
            } else {
                $(this.el).css('left', this.model.get('x') + 'px');
                $(this.el).css('top', this.model.get('y') + 'px');

                $("#whiteboard").append($(this.el).html(compiledTemplate));
            }
        },
        downloadFile : function(evt) {
            evt.preventDefault();
            var url = config.contextPath+"/attachment/"+this.model.id+"/"+this.model.get('filename')+"/download.htm";
            window.open(url,'_blank');
        },
        isClicked : function(evt) {
            evt.preventDefault();
            window.app.eventDispatcher.trigger("attachment:isClicked", this.model);
        }
    });

    return AttachmentView;
});
