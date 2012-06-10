define([ 'jquery', 
         'underscore', 
         'backbone',
         '/core/js/utils/model_command.js',
         '/whiteboardItem/js/views/whiteboarditem.js',
         'text!/image/templates/image.html'
],function($, _, Backbone, ModelCommand,WhiteboardItemView,imageTemplate) {
    var ImageView = WhiteboardItemView.extend({
        name : 'image',
        baseWidth : null,
        events : {
            'blur input[type=text],  textarea' : 'isBlured',
            'dblclick .imageItems' : 'openFancybox',
            'click .imageItems' : 'isClicked'
            
        },
        constructor: function(){
            this.events = _.extend( {}, WhiteboardItemView.prototype.events, this.events );
            WhiteboardItemView.prototype.constructor.apply( this, arguments );
         },
        initialize : function(options) {
            WhiteboardItemView.prototype.initialize.apply( this );
            _.bindAll(this, 'isBlured', 'edited','changed','assignmentChanged', 'isClicked', 'openFancybox', 'render');
            
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
//            this.image = $('.imageItems img',this.el);
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
                image : this.model,
                creator:_creator,
                _ : _
            };
            var compiledTemplate = _.template(imageTemplate, data);
            var imageWidth;
            if ($("#image-" + this.model.id).length > 0) {
                $("#image-" + this.model.id).css('left',
                        this.model.get('x') + 'px');
                $("#image-" + this.model.id).css('top',
                        this.model.get('y') + 'px');
                $("#image-" + this.model.id).html(compiledTemplate);
                if (this.baseWidth != null) {
                    imageWidth = this.model.get('content').get('scale') * this.baseWidth;
                    $("#image-" + this.model.id).find(".image img").attr(
                            'width', imageWidth);
                    $("#image-" + this.model.id).find(".imageMenu").css(
                            'padding-left', imageWidth + 1 + 'px');
                }

                //

            } else {
                $(this.el).css('left', this.model.get('x') + 'px');
                $(this.el).css('top', this.model.get('y') + 'px');
                $("#whiteboard").append($(this.el).html(compiledTemplate));
                if (this.baseWidth != null) {
                    imageWidth = this.model.get('content').get('scale') * this.baseWidth;
                    $(this.el).find('.image img').attr('width', imageWidth);
                    $(this.el).find('.imageMenu').css('padding-left',
                            imageWidth + 1 + 'px');
                }

            }
            var self = this;
            var model = this.model;
            var id = model.id;
            if (this.baseWidth == null) {
                $("#image-" + id + ' .image').find('img').load(
                        function() {
                            self.baseWidth = this.width;
                            imageWidth = model.get('content').get('scale') * this.width;
                            $(this).attr('width', imageWidth);
                            $("#image-" + id + ' .imageMenu').css(
                                    'padding-left', imageWidth + 1 + 'px');
                        });
            }
        },
        isClicked : function(evt) {
            evt.preventDefault();
            //window.app.eventDispatcher.trigger("image:isClicked", this.model);
        },
        openFancybox : function(evt) {
            evt.preventDefault();
            var imgSrc = config.contextPath+"/"+$(this.el).find('.image img').attr('src')+"?type=.png";
            $.fancybox({
                href: imgSrc
            });
        },
    });

    return ImageView;
});
