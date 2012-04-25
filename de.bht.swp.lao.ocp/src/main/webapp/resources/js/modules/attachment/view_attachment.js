define([ 'jquery', 'underscore', 'backbone', 'jqueryui',
        'text!templates/attachment/attachment.html', ], function($, _, Backbone, jqueryui,
        attachmentTemplate) {

    var AttachmentView = Backbone.View.extend({
        events : {
            'click .file_mouseOverMenu_bottom' : 'deleteClicked',
            'dblclick .attachmentItems' : 'downloadFile',
        },
        initialize : function(options) {
            _.bindAll(this, 'deleteClicked','changed','handleDragItem');
            
            this.controller = options.controller;
            
            this.model.bind('change',this.changed,this);

            $(this.el).attr("id", "attachment-"+this.model.id);
            $(this.el).addClass("whiteboarditem attachment draggable hoverable");
            $(this.el).css('position', 'absolute');
            
            var self = this;
            $(this.el).draggable({
                handle : $('.file_mouseOverMenu_top', this),
                scroll : false,
                drag : self.handleDragItem,
                stop : function(e, ui) {
                    var id = $(this).attr('id');
                    $(this).find('.attachmentMenu').css('display', '');
                    $(this).find('.creator').css('display', '');
                    self.persistPosition();
                    $.each($('div.whiteboard > div'), function(i,elem) {
                        $(elem).data('oldPosX','').data('oldPosY','');
                    });
                    // find view
                    views = ((window.app.modules.note.views).concat(window.app.modules.attachment.views)).filter(function(){return true});
                    $.each(views,function(j,view) {
                        if(view && $(view.el).attr('id') != id && $(view.el).hasClass('selected')) {
                            view.persistPosition();
                        }
                    });
                }
            });
            this.render();
        },
        persistPosition: function() {
            _x = parseInt($(this.el).css('left'),10);
            _y = parseInt($(this.el).css('top'),10);
            this.model.set({
                x : _x,
                y : _y
            });
            
            window.app.publish('/service/whiteboardItem/move', {
                id : this.model.id,
                x : _x,
                y : _y,
                whiteboardid : this.options.whiteboardId
            });
            window.app.log("note move published to wb("+this.options.whiteboardId+")");
        },
        handleDragItem: function(e) {
            // find all selected items
            var elem = $('div.whiteboard > div.selected');
            // do it only if more than two are selected and elem itself is selected
            console.log(this.el);
            if(elem.length > 1 && $(this.el).hasClass('selected')) {
                $.each(elem,function(i,element) {
                    // dont move current element - it moves by itself
                    if($(e.target).attr('id') != $(element).attr('id')) {
                        var posX = parseInt($(element).css('left')),
                            posY = parseInt($(element).css('top')),
                            targetX = parseInt($(e.target).css('left'),10)-5,
                            targetY = parseInt($(e.target).css('top'),10)+16;
                        // save start pos to get the diff
                        if(!$(element).data('oldPosX')) {
                            $(element).data('oldPosX',posX);
                            $(element).data('oldPosY',posY);
                            $(e.target).data('oldPosX',targetX);
                            $(e.target).data('oldPosY',targetY);
                        }
                        // change position
                        $(element).css('left',$(element).data('oldPosX') - ($(e.target).data('oldPosX')+$(e.target).width()-e.clientX));
                        $(element).css('top',$(element).data('oldPosY') - ($(e.target).data('oldPosY')-e.clientY));
                    }
                });
            }
            $(this.el).find('.noteMenu').css('display','block');
            $(this.el).find('.creator').css('display','block');
        },
        changed:function(){
            this.render();
        },
        render : function() {
            window.app.log("render");
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
        },
        downloadFile : function(evt) {
            evt.preventDefault();
            window.app.log("download clicked");
            var url = config.contextPath+"/attachment/"+this.model.id+"/"+this.model.get('filename')+"/download.htm";
            window.open(url,'_blank');
        }
    });

    return AttachmentView;
});
