define([ 'jquery', 
         'jqueryfancy',
         'underscore', 
         'backbone',
         '/core/js/utils/model_command.js',
         '/whiteboardItem/js/views/whiteboarditem.js',
         'text!/attachment/templates/attachment.html'
],function($, JQueryFancy, _, Backbone, ModelCommand,WhiteboardItemView,attachmentTemplate) {
    var AttachmentView = WhiteboardItemView.extend({
        name : 'attachment',
        events : {
            'dblclick .attachmentItems' : 'downloadAttachment',
            'click .attachmentItems' : 'isClicked'
            
        },
        constructor: function(){
            this.events = _.extend( {}, WhiteboardItemView.prototype.events, this.events );
            WhiteboardItemView.prototype.constructor.apply( this, arguments );
         },
        initialize : function(options) {
            WhiteboardItemView.prototype.initialize.apply( this );
            _.bindAll(this, 'isBlured','changed','assignmentChanged', 'isClicked', 'downloadAttachment', 'render');
            
            this.controller = options.controller;
            this.delegateEvents();
        },
        assignmentChanged:function(){
            this.render();
        },
        changed:function(){
            console.log('changed');
                this.render();
        },
        isFocused : function() {
            $(this.el).addClass(".edited");
        },
        isBlured : function() {
            $(this.el).removeClass(".edited");
        },
        render : function() {
            console.log("render attachment");
            var _creator = window.app.modules.assignment.getUser(this.model.get('creator'));
            if(!_creator)return false;
            
            var data = {
                attachment : this.model,
                creator:_creator,
                _ : _
            };
            var compiledTemplate = _.template(attachmentTemplate, data);
            $(this.el).attr("id", this.model.id);
            $(this.el).addClass("whiteboarditem attachment draggable hoverable");
            
            if ($('#'+this.model.id).length > 0) {
                $('#'+this.model.id).css('left',
                        this.model.get('x') + 'px');
                $('#'+this.model.id).css('top',
                        this.model.get('y') + 'px');
                $('#'+this.model.id).html(compiledTemplate);
                

            } else {
                $(this.el).css('left', this.model.get('x') + 'px');
                $(this.el).css('top', this.model.get('y') + 'px');
                $("#whiteboard").append($(this.el).html(compiledTemplate));

            }
        },
        isClicked : function(evt) {
            evt.preventDefault();
            window.app.eventDispatcher.trigger("attachment:isClicked", this.model);
        },
        downloadAttachment : function(evt) {
            evt.preventDefault();
        },
    });

    return AttachmentView;
});
