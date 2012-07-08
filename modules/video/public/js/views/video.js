define([ 'jquery',
         'underscore',
         '/core/js/utils/model_command.js',
         '/whiteboardItem/js/views/whiteboarditem.js',
         'text!/video/templates/video.html'
],function($, _, ModelCommand,WhiteboardItemView,videoTemplate) {

    var VideoView = WhiteboardItemView.extend({

        name : 'video',
        events : {},
        constructor: function(){
            this.events = _.extend( {}, WhiteboardItemView.prototype.events, this.events );
            WhiteboardItemView.prototype.constructor.apply( this, arguments );
         },
        initialize : function(options) {
            WhiteboardItemView.prototype.initialize.apply( this );
            // _.bindAll(this, );

            $(this.el).attr("id", this.model.id).addClass("video");

            this.controller = options.controller;
            this.delegateEvents();
        },
        getPlayerInstance: function() {
            var player = {};

            if(this.model.get('content').get('provider') === 'youtube') {
                player = $('<iframe />')
                    .attr('type','text/html')
                    .attr('width',640)
                    .attr('height',390)
                    .attr('src','http://www.youtube.com/embed/'+this.model.get('content').get('videoID')+'?html5=1')
                    .attr('frameborder',0);
            } else {
                player = $('<iframe />')
                    .attr('width',640)
                    .attr('height',390)
                    .attr('src','http://player.vimeo.com/video/'+this.model.get('content').get('videoID'))
                    .attr('frameborder',0);
            }

            return player;
        },
        render : function() {
            var data = {
                player: this.getPlayerInstance()
            };

            var compiledTemplate = _.template(videoTemplate, data);
            
            $(this.el).css('left', this.model.get('x') + 'px');
            $(this.el).css('top', this.model.get('y') + 'px');
            $(this.el).css('z-index', this.model.get('orderIndex'));
            $(this.el).html(compiledTemplate);

            return this;
        }
    });

    return VideoView;
});
