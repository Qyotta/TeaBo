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
            'dblclick .content' : 'openFancybox',
            'click .content' : 'isClicked'
        },
        constructor: function(){
            this.events = _.extend( {}, WhiteboardItemView.prototype.events, this.events );
            WhiteboardItemView.prototype.constructor.apply( this, arguments );
         },
        initialize : function(options) {
            WhiteboardItemView.prototype.initialize.apply( this );
            _.bindAll(this, 'changed','assignmentChanged', 'isClicked', 'openFancybox', 'render');
            
            this.model.get('content').bind('change:scale',this.changed,this);
            
            $(this.el).attr("id", this.model.id);
            $(this.el).addClass("image");

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
            
            var data = {
                image : this.model,
                _ : _
            };
            var compiledTemplate = _.template(imageTemplate, data);
            
            var imageWidth;
            
            $(this.el).css('left', this.model.get('x') + 'px');
            $(this.el).css('top', this.model.get('y') + 'px');
            $(this.el).css('z-index', this.model.get('orderIndex'));
            $(this.el).html(compiledTemplate);
            
            if (this.baseWidth != null) {
                imageWidth = this.model.get('content').get('scale') * this.baseWidth;
                $(this.el).find('.content img').attr('width', imageWidth);
            }else{
                var self = this;
                var model = this.model;
                var id = model.id;
                
                $(this.el).find('.content img').load(
                    function() {
                        self.baseWidth = this.width;
                        imageWidth = model.get('content').get('scale') * this.width;
                        $(this).attr('width', imageWidth);
                        self.render();
                    }
                );
            }
            return this;
        },
        isClicked : function(evt) {
            evt.preventDefault();
            window.app.eventDispatcher.trigger("image:isClicked", this.model);
        },
        openFancybox : function(evt) {
            evt.preventDefault();
            var imgSrc = $(this.el).find('.content img').attr('src')+"?type=.png";
            
            $.fancybox({
                href: imgSrc
            });
        },
    });

    return ImageView;
});
