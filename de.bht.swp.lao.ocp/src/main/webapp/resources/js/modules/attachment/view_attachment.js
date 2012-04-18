define([ 'jquery', 'underscore', 'backbone', 'jqueryui',
        'text!templates/note/note.html', ], function($, _, Backbone, jqueryui,
        noteTemplate) {

    var AttachmentView = Backbone.View.extend({
        events : {
            'click .file_mouseOverMenu_bottom' : 'deleteClicked'
        },
        initialize : function(options) {
            _.bindAll(this, 'deleteClicked','edited','changed');
            this.model.bind('change',this.changed,this);
            this.editing = false;

            var self = this;
            $(this.el).draggable({
                handle : $('.file_mouseOverMenu_top', this),
                scroll : false,
                // drag: _handleDragItem,
                stop : function(e, ui) {
                    var id = $(this).attr('id');
                    $(this).find('.noteMenu').css('display', '');
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
            
            this.render();
        },
        changed:function(){
            window.app.log("changed("+this.model.id+")");
            this.render();
        },
        render : function() {
            var data = {
                note : this.model,
                _ : _
            };
            var compiledTemplate = _.template(noteTemplate, data);
            
            $(this.el).attr("id", "attachment-"+this.model.id);
            $(this.el).addClass("attachment draggable");

            
            $(this.el).css('position', 'absolute');
            if ($("#attachment-" + this.model.id).length > 0) {
                $("#attachment-" + this.model.id).css('left', this.model.get('x') + 'px');
                $("#attachment-" + this.model.id).css('top', this.model.get('y') + 'px');
                $("#attachment-" + this.model.id).html(compiledTemplate);
            } else {
                window.app.log($(this.el));
                $(this.el).css('left', this.model.get('x') + 'px');
                $(this.el).css('top', this.model.get('y') + 'px');
                $("#whiteboard").append($(this.el).html(compiledTemplate));
            }
            
            var textarea = $(this.el).find('textarea');
            textarea.css('height', textarea[0].scrollHeight / 2 + 'px');
            textarea.css('height', textarea[0].scrollHeight + 'px');
        },
        deleteClicked : function() {
            window.app.eventDispatcher.trigger("attachment:delete_clicked", this.model);
        }
    });

    return AttachmentView;
});
