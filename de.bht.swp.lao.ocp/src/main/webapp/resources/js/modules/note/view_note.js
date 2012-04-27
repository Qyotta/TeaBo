define([ 'jquery', 
         'underscore', 
         'backbone',
         'core/utils/model_command',
         'core/views/whiteboarditem',
         'text!templates/note/note.html'], 
         function($, _, Backbone, ModelCommand,WhiteboardItemView,noteTemplate) {
    var NoteView = WhiteboardItemView.extend({
        name : 'note',
        events : {
            'focus input[type=text], textarea' : 'isFocused',
            'blur input[type=text],  textarea' : 'isBlured',
        },
        constructor: function(){
            this.events = _.extend( {}, WhiteboardItemView.prototype.events, this.events );
            WhiteboardItemView.prototype.constructor.apply( this, arguments );
         },
        initialize : function(options) {
            WhiteboardItemView.prototype.initialize.apply( this );
            window.app.log("note created");
            _.bindAll(this, 'isFocused', 'isBlured', 'edited','changed');
            this.model.bind('change',this.changed,this);
            this.editing    = false;
            this.controller = options.controller;
            
            this.render();
            this.delegateEvents();
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

            if(_text == _oldText) return;
            
            this.model.set({text:_text});
            window.app.groupCommand.addCommands(new ModelCommand(
                '/service/note/edit/',
                {
                    id : this.model.id,
                    text: this.model.get('text'),
                    whiteboardid : this.options.whiteboardId
                }
            ));
            
        },
        isFocused : function() {
            window.app.log("focused");
            this.editing = true;
            $(this.el).addClass(".edited");
            this.timer = setInterval(this.edited, 500);
        },
        isBlured : function() {
            window.app.log("blured");
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
                $("#note-" + this.model.id).css('z-index', this.model.get('orderIndex'));
                $("#note-" + this.model.id).html(compiledTemplate);
            } else {
                $(this.el).css('left', this.model.get('x') + 'px');
                $(this.el).css('top', this.model.get('y') + 'px');
                $(this.el).css('z-index', this.model.get('orderIndex'));
                $("#whiteboard").append($(this.el).html(compiledTemplate));
            }
            
            var textarea = $(this.el).find('textarea');
            textarea.css('height', textarea[0].scrollHeight / 2 + 'px');
            textarea.css('height', textarea[0].scrollHeight + 'px');
        },
    });

    return NoteView;
});
