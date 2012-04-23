define([ 'jquery', 'underscore', 'backbone', 'jqueryui',
        'text!templates/attachment/attachment.html', ], function($, _, Backbone, jqueryui,
        attachmentTemplate) {

    var AttachmentView = Backbone.View.extend({
        events : {
            'click .file_mouseOverMenu_bottom' : 'deleteClicked'
        },
        initialize : function(options) {
            _.bindAll(this, 'deleteClicked','changed');
            
            this.controller = options.controller;
            
            this.model.bind('change',this.changed,this);

            $(this.el).attr("id", "attachment-"+this.model.id);
            $(this.el).addClass("attachment draggable hoverable");
            $(this.el).css('position', 'absolute');
            
            var self = this;
            $(this.el).draggable({
                handle : $('.file_mouseOverMenu_top', this),
                scroll : false,
                //drag : _handleDragItem,
                stop : function(e, ui) {
                    var id = $(this).attr('id');
                    $(this).find('.attachmentMenu').css('display', '');
                    $(this).find('.creator').css('display', '');
                    _x = parseInt($(this).css('left'));
                    _y = parseInt($(this).css('top'));
                    self.model.set({
                        x : _x,
                        y : _y
                    });
                    
                    window.app.publish('/service/whiteboardItem/move', {
                        id : self.model.id,
                        x : _x,
                        y : _y,
                        whiteboardid : self.options.whiteboardId
                    });
                    window.app.log("attachment move published to wb("+self.options.whiteboardId+")");
                }
            });
            window.app.log("attachment view");
            this.render();
        },
        changed:function(){
            this.render();
        },
        render : function() {
        	var filename = this.model.get('filename');
        	var ext = filename.split('.').pop(),
            shortName = filename.substr(0, filename.length - (ext.length + 1)),
            
            imgPath = config.contextPath+"/resources/images/teambox-free-file-icons/32px/"+ext+".png";
        	
        	if(!this.model.isComplete()){
        		window.app.log(this.controller.activeUpload);
	        	if (this.controller.activeUpload != null && this.model.get('uid') === this.controller.activeUpload[1]){
	    	        imgPath = config.contextPath+"/resources/images/loading.gif";
	    	    } else {
	    	    	imgPath = config.contextPath+"/resources/images/stop.gif";
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
        deleteClicked : function(evt) {
        	evt.preventDefault();
        	window.app.eventDispatcher.trigger("attachment:delete_clicked", this.model);
        }
    });

    return AttachmentView;
});
