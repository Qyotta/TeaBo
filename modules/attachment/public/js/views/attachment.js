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
            
            
            var filename = this.model.get('content').get('filename');
            var ext = this.model.get('content').get('extension');
            var _shortName = filename.substr(0, filename.length - (ext.length + 1));
            var _img;
            if(!this.model.get('content').get('complete')){
                _img = '/attachment/images/extensions/_blank.png';
            }else {
                _img = '/attachment/images/extensions/'+ext+'.png';
            }
            
            var data = {
                attachment : this.model,
                creator:_creator,
                img : _img,
                shortName : _shortName,
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
            var url = '/image/download'+this.model.id;
            window.open(url,'_blank');
        },
    });

    return AttachmentView;
});
