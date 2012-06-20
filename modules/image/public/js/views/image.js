define([ 'jquery', 
         'jqueryfancy',
         'underscore', 
         'backbone',
         '/core/js/utils/model_command.js',
         '/whiteboardItem/js/views/whiteboarditem.js',
         'text!/image/templates/image.html'
],function($, JQueryFancy, _, Backbone, ModelCommand,WhiteboardItemView,imageTemplate) {
    var ImageView = WhiteboardItemView.extend({
        name : 'image',
        baseWidth : null,
        events : {
            'dblclick .imageItems' : 'openFancybox',
            'click .imageItems' : 'isClicked'
        },
        constructor: function(){
            this.events = _.extend( {}, WhiteboardItemView.prototype.events, this.events );
            WhiteboardItemView.prototype.constructor.apply( this, arguments );
         },
        initialize : function(options) {
            WhiteboardItemView.prototype.initialize.apply( this );
            _.bindAll(this, 'changed','assignmentChanged', 'isClicked', 'openFancybox', 'render');
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
        render : function() {
            var _creator = window.app.modules.assignment.getUser(this.model.get('creator'));
            if(!_creator)return false;
            
            var data = {
                image : this.model,
                creator:_creator,
                _ : _
            };
            var compiledTemplate = _.template(imageTemplate, data);
            $(this.el).attr("id", this.model.id);
            $(this.el).addClass("image");
            
            var imageWidth;
            if ($('#'+this.model.id).length > 0) {
                $('#'+this.model.id).css('left',
                        this.model.get('x') + 'px');
                $('#'+this.model.id).css('top',
                        this.model.get('y') + 'px');
                $('#'+this.model.id).html(compiledTemplate);
                if (this.baseWidth != null) {
                    imageWidth = this.model.get('content').get('scale') * this.baseWidth;
                    $("#" + this.model.id).find(".imageItems img").attr(
                            'width', imageWidth);
                }
            } 
            else {
                $(this.el).css('left', this.model.get('x') + 'px');
                $(this.el).css('top', this.model.get('y') + 'px');
                $("#whiteboard").append($(this.el).html(compiledTemplate));
                if (this.baseWidth != null) {
                    imageWidth = this.model.get('content').get('scale') * this.baseWidth;
                    $(this.el).find('.imageItems img').attr('width', imageWidth);
                }
            }
            var self = this;
            var model = this.model;
            var id = model.id;
            if (this.baseWidth == null) {
                $("#" + id + ' .imageItems').find('img').load(
                        function() {
                            self.baseWidth = this.width;
                            imageWidth = model.get('content').get('scale') * this.width;
                            $(this).attr('width', imageWidth);
                        });
            }
        },
        isClicked : function(evt) {
            evt.preventDefault();
            window.app.eventDispatcher.trigger("image:isClicked", this.model);
        },
        openFancybox : function(evt) {
            evt.preventDefault();
            var imgSrc = $(this.el).find('.imageItems img').attr('src')+"?type=.png";
            
            $.fancybox({
                href: imgSrc
            });
        },
    });

    return ImageView;
});
