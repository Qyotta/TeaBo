define([ 'jquery',
         'underscore',
         'backbone',
         '/core/js/utils/model_command.js',
         '/whiteboardItem/js/views/whiteboarditem.js',
         'text!/note/templates/note.html'
],function($, _, Backbone, ModelCommand,WhiteboardItemView,noteTemplate) {
    var NoteView = WhiteboardItemView.extend({
        name : 'note',
        events : {
            'focus input[type=text], textarea' : 'isFocused',
            'blur input[type=text],  textarea' : 'isBlured'
        },
        constructor: function(){
            this.events = _.extend( {}, WhiteboardItemView.prototype.events, this.events );
            WhiteboardItemView.prototype.constructor.apply( this, arguments );
         },
        initialize : function(options) {
            WhiteboardItemView.prototype.initialize.apply( this );
            _.bindAll(this, 'isFocused', 'isBlured', 'edited','changed','assignmentChanged','assignmentsSynced');
            
            this.model.get('content').bind('change:text',this.changed,this);
            
            this.controller = options.controller;
            this.editing    = false;
            this.delegateEvents();
            this.bindEvents();
        },
        bindEvents:function(){
            window.app.eventDispatcher.bind('assignment:synced',this.assignmentsSynced);
        },
        unbindEvents:function(){
            window.app.eventDispatcher.unbind('assignment:synced',this.assignmentsSynced);
        },
        destroy:function(){
            this.unbindEvents();
            this.undelegateEvents();
        },
        assignmentsSynced:function(){
            this.assignment = window.app.modules.assignment.getAssignment(this.model.get('creator'));
            this.assignment.bind('change',this.assignmentChanged);
            this.render();
        },
        assignmentChanged:function(){
            this.render();
        },
        changed:function(){
            var textarea = $('#'+this.model.id).find('textarea'),
                order    = this.model.get('orderIndex');

            textarea.css('height', textarea[0].scrollHeight / 2 + 'px');
            textarea.css('height', textarea[0].scrollHeight + 'px');

            $('#'+this.model.id).css('z-index', order);
            if(!this.editing){
                this.render();
            }
        },
        edited : function() {
            this.input = $('.content textarea',this.el);
            var _text  = this.input.val();
            var _oldText = this.model.get('content').get('text');

            if(_text == _oldText) return;
            
            this.model.get('content').set({text:_text});
            window.app.groupCommand.addCommands(new ModelCommand(
                '/service/note/edit',
                {
                    id : this.model.id,
                    text: this.model.get('content').get('text'),
                    whiteboardid : this.controller.whiteboard.id
                }
            ));
        },
        isFocused : function() {
            this.editing = true;
            $(this.el).addClass("edited");
            this.timer = setInterval(this.edited, 500);
        },
        isBlured : function() {
            this.editing = false;
            $(this.el).removeClass("edited");

            if (this.timer) {
                clearInterval(this.timer);
            }
        },
        render : function() {
            var _creator = window.app.modules.assignment.getUser(this.model.get('creator'));
            if(!_creator)return false;
            
            var data = {
                note : this.model,
                creator:_creator,
                _ : _
            };
            var compiledTemplate = _.template(noteTemplate, data);
            
            $(this.el).attr("id", this.model.id);
            $(this.el).addClass("note");
            
            if ($('#'+this.model.id).length > 0) {
                $('#'+this.model.id).css('left', this.model.get('x') + 'px');
                $('#'+this.model.id).css('top', this.model.get('y') + 'px');
                $('#'+this.model.id).css('z-index', this.model.get('orderIndex'));
                $('#'+this.model.id).html(compiledTemplate);
            } else {
                $(this.el).css('left', this.model.get('x') + 'px');
                $(this.el).css('top', this.model.get('y') + 'px');
                $(this.el).css('z-index', this.model.get('orderIndex'));
                $("#whiteboard").append($(this.el).html(compiledTemplate));
            }
            
            var textarea = $(this.el).find('textarea');
            textarea.css('height', textarea[0].scrollHeight / 2 + 'px');
            textarea.css('height', textarea[0].scrollHeight + 'px');
            var _color = window.app.modules.assignment.getColor(this.model.get('creator'));
            if(_color){
                $('.content',$(this.el)).css('background',"rgb("+_color[0]+","+_color[1]+","+_color[2]+")");
            }
        }
    });

    return NoteView;
});
