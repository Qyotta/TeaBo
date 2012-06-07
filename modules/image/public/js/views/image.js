define([ 'jquery', 
         'underscore', 
         'backbone',
         '/core/js/utils/model_command.js',
         '/whiteboardItem/js/views/whiteboarditem.js',
         'text!/image/templates/image.html'
],function($, _, Backbone, ModelCommand,WhiteboardItemView,imageTemplate) {
    var ImageView = WhiteboardItemView.extend({
        name : 'image',
        events : {
            'blur input[type=text],  textarea' : 'isBlured',
        },
        constructor: function(){
            this.events = _.extend( {}, WhiteboardItemView.prototype.events, this.events );
            WhiteboardItemView.prototype.constructor.apply( this, arguments );
         },
        initialize : function(options) {
            WhiteboardItemView.prototype.initialize.apply( this );
            _.bindAll(this, 'isBlured', 'edited','changed','assignmentChanged');
            
            this.model.get('content').bind('change:scale',this.changed,this);
            
            this.controller = options.controller;
            this.delegateEvents();
        },
        assignmentChanged:function(){
            this.render();
        },
        changed:function(){
                this.render();
        },
        edited : function(_newScale) {
            this.image = $('.imageItems img',this.el);
            var _oldText = this.model.get('content').get('text');

            if(_newScale == _oldText) return;
            
            this.model.get('content').set({scale:_newScale});
            window.app.groupCommand.addCommands(new ModelCommand(
                '/service/image/edit',
                {
                    id : this.model.id,
                    scale: this.model.get('content').get('scale'),
                    whiteboardid : this.controller.whiteboard.id
                }
            ));
        },
        isFocused : function() {
            $(this.el).addClass(".edited");
        },
        isBlured : function() {
            $(this.el).removeClass(".edited");
        },
        render : function() {
            var _creator = window.app.modules.assignment.getUser(this.model.get('creator'));
            if(!_creator)return false;
            
            var data = {
                note : this.model,
                creator:_creator,
                _ : _
            };
            var compiledTemplate = _.template(imageTemplate, data);
            
            $(this.el).attr("id", this.model.id);
            $(this.el).addClass("whiteboarditem image draggable hoverable");
            
            $(this.el).css('position', 'absolute');
            if ($(this.model.id).length > 0) {
                $(this.model.id).css('left', this.model.get('x') + 'px');
                $(this.model.id).css('top', this.model.get('y') + 'px');
                $(this.model.id).css('z-index', this.model.get('orderIndex'));
                $(this.model.id).html(compiledTemplate);
            } else {
                $(this.el).css('left', this.model.get('x') + 'px');
                $(this.el).css('top', this.model.get('y') + 'px');
                $(this.el).css('z-index', this.model.get('orderIndex'));
                $("#whiteboard").append($(this.el).html(compiledTemplate));
            }
            
        },
    });

    return ImageView;
});
