define([
    'jquery',
    'underscore',
    'backbone',
    '/core/js/views/dialogs/dialog.js',
    'text!/video/templates/dialog.html',
    '/core/js/utils/model_command.js'
], function($, _, Backbone, Dialog, videoDialogTemplate, ModelCommand) {
    var VideoDialog = Dialog.extend({
        initialize: function(options) {
            _.bindAll(this, 'showVideoDialog');
            this.controller = options.controller;
        },
        events: {
            'click button.cancel' : 'hideVideoDialog',
            'submit form' : 'submitVideo'
        },
        render: function() {
            var data = {};
            var compiledTemplate = _.template(videoDialogTemplate, data);

            $(this.el).html(compiledTemplate);
            $('#dialogs').html(this.el);
            this.delegateEvents();
        },
        showVideoDialog: function() {
            this.showDialog();
        },
        hideVideoDialog: function(evt) {
            if(evt) evt.preventDefault();
            this.hideDialog();
        },
        parseVideoURL: function(url) {

            function getParm(url, base) {
                var re = new RegExp("(\\?|&)" + base + "\\=([^&]*)(&|$)");
                var matches = url.match(re);
                if (matches) {
                    return(matches[2]);
                } else {
                    return("");
                }
            }

            var retVal = {};
            var matches;

            if (url && url.indexOf("youtube.com/watch") != -1) {
                retVal.provider = "youtube";
                retVal.id = getParm(url, "v");
            } else {
                matches = url.match(/vimeo.com\/(\d+)/);
                retVal.provider = "vimeo";
                retVal.id = matches[1];
            }
            return(retVal);
        },
        submitVideo: function(evt) {
            evt.preventDefault();
            
            var url       = $('.videoURL').val(),
                parsedURL = this.parseVideoURL(url);

            window.app.groupCommand.addCommands(new ModelCommand( '/service/whiteboardItem/post', {
                    creator      : window.app.user.id,
                    whiteboardid : $('#whiteboard').data('id'),
                    content      : {videoID: parsedURL.id, provider: parsedURL.provider},
                    type         : 'video',
                    x            : 400,
                    y            : 400
                }
            ));
            this.hideVideoDialog();
        }
    });
    return VideoDialog;
});
