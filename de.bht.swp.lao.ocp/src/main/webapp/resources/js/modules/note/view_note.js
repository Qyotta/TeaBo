define([ 'jquery', 'underscore', 'backbone', 'jqueryui',
        'text!templates/note/note.html', ], function($, _, Backbone, jqueryui,
        noteTemplate) {

    var NoteView = Backbone.View.extend({
        events : {
            'focus input[type=text], textarea' : 'isFocused',
            'blur input[type=text],  textarea' : 'isBlured',
            'click .file_mouseOverMenu_bottom' : 'deleteClicked'
        },
        initialize : function(options) {
            _.bindAll(this, 'isFocused', 'isBlured', 'deleteClicked','edited','changed');
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
                    window.app.log("note move published to wb("+self.options.whiteboardId+")");
                }
            });
            
            this.render();
        },
        changed:function(){
            window.app.log("changed("+this.model.id+",editing: "+this.editing+")");
            
            var textarea = $('#note-'+this.model.id).find('textarea');
            textarea.css('height', textarea[0].scrollHeight / 2 + 'px');
            textarea.css('height', textarea[0].scrollHeight + 'px');
            
            if(!this.editing){
                this.render();
            }
        },
        edited : function() {
            this.input = $('.noteItems textarea',this.el);
            var _text  = this.input.val();
            var _oldText = this.model.get('text');

            if(_text == _oldText)return;
            
            this.model.set({text:_text});
            
            window.app.publish('/service/note/edit/', {
                id : this.model.id,
                text: this.model.get('text'),
                whiteboardid : this.options.whiteboardId
            });
        },
        isFocused : function() {
            this.editing = true;
            $(this.el).addClass(".edited");
            this.timer = setInterval(this.edited, 500);
        },
        isBlured : function() {
            this.editing = false;
            $(this.el).removeClass(".edited");

            if (this.timer) {
                clearInterval(this.timer);
            }
        },
        render : function() {
            var data = {
                note : this.model,
                _ : _
            };
            var compiledTemplate = _.template(noteTemplate, data);
            
            $(this.el).attr("id", "note-"+this.model.id);
            $(this.el).addClass("note draggable");

            
            $(this.el).css('position', 'absolute');
            if ($("#note-" + this.model.id).length > 0) {
                $("#note-" + this.model.id).css('left', this.model.get('x') + 'px');
                $("#note-" + this.model.id).css('top', this.model.get('y') + 'px');
                $("#note-" + this.model.id).html(compiledTemplate);
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
            window.app.eventDispatcher.trigger("note:delete_clicked", this.model);
        }
    });

    return NoteView;
});
