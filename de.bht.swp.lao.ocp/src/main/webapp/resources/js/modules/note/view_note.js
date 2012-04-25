define([ 'jquery', 
         'underscore', 
         'backbone', 
         'jqueryui',
         'text!templates/note/note.html'], 
         function($, _, Backbone, jqueryui, noteTemplate) {
    var NoteView = Backbone.View.extend({
        events : {
            'focus input[type=text], textarea' : 'isFocused',
            'blur input[type=text],  textarea' : 'isBlured',
            'click .file_mouseOverMenu_bottom' : 'deleteClicked'
        },
        initialize : function(options) {
            _.bindAll(this, 'isFocused', 'isBlured', 'deleteClicked','edited','changed','persistPosition','handleDragItem');
            this.model.bind('change',this.changed,this);
            this.editing = false;
            this.controller = options.controller;
            //console.log(this.controller);
            var self = this;
            $(this.el).draggable({
                handle : $('.file_mouseOverMenu_top', this),
                scroll : false,
                drag : this.handleDragItem,
                stop : function(e, ui) {
                    var id = $(this).attr('id');
                    $(this).find('.noteMenu').css('display', '');
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
            $(this.el).addClass("whiteboarditem note draggable hoverable");

            
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
