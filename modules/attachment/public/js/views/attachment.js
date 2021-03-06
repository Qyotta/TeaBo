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
            'dblclick .content' : 'downloadAttachment',
            'click .content' : 'isClicked'
        },
        constructor: function(){
            this.events = _.extend( {}, WhiteboardItemView.prototype.events, this.events );
            WhiteboardItemView.prototype.constructor.apply( this, arguments );
         },
        initialize : function(options) {
            WhiteboardItemView.prototype.initialize.apply( this );
            _.bindAll(this, 'changed','assignmentChanged', 'isClicked', 'downloadAttachment', 'render');
            
            $(this.el).attr("id", this.model.id);
            $(this.el).addClass("attachment");
            
            this.controller = options.controller;
            this.delegateEvents();
        },
        assignmentChanged:function(){
            this.render();
        },
        changed:function(){
            this.render();
        },
        render : function() {
            var _creator = window.app.modules.assignment.getUser(this.model.get('creator'));
            if(!_creator)return false;
            
            
            var filename = this.model.get('content').get('filename');
            var ext = this.model.get('content').get('extension');
            var _shortName = filename.substr(0, filename.length - (ext.length + 1));
            var _img;
            var _loadingIcon;
            _img = '/attachment/images/extensions/'+ext+'.png';
            if(this.model.get('content').get('complete') == false){
                if(window.app.user.id == _creator.id){
                    _loadingIcon = '/attachment/images/loading.png';
                } else {
                    _loadingIcon = '/attachment/images/stop.png';
                }
                _loadingIcon = '<img class="loadingIcon" src="'+_loadingIcon+'">';
            }else {
                _loadingIcon = '';
            }
            
            var data = {
                attachment : this.model,
                creator:_creator,
                img : _img,
                loadingIcon : _loadingIcon,
                shortName : _shortName,
                _ : _
            };
            var compiledTemplate = _.template(attachmentTemplate, data);
            
            $(this.el).css('left', this.model.get('x') + 'px');
            $(this.el).css('top', this.model.get('y') + 'px');
            $(this.el).css('z-index', this.model.get('orderIndex'));
            $(this.el).html(compiledTemplate);
            return this;
        },
        isClicked : function(evt) {
            evt.preventDefault();
            $(this.el).addClass('edited');
            window.app.eventDispatcher.trigger("attachment:isClicked", this.model);
        },
        downloadAttachment : function(evt) {
            evt.preventDefault();
            var url = '/attachment/'+this.model.id;
            window.open(url,'_blank');
        },
    });

    return AttachmentView;
});
