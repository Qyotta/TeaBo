define([
    'underscore',
    '/video/js/views/dialog.js'
], function(_,Dialog){
    
    var VideoController = function(options){
        _.bindAll(this,'openDialog');
        window.app.eventDispatcher.bind("toolbar:addVideo", this.openDialog);
        window.app.eventDispatcher.bind("whiteboard:opened",this.whiteboardOpened);
        window.app.eventDispatcher.bind("whiteboard:closed",this.whiteboardClosed);

        this.initialize();
    };
    
    VideoController.prototype = {
        initialize: function() {
            this.dialog = new Dialog({controller:this});
        },
        index: 5,
        toolbarTool: {
            name: 'Video',
            action: 'addVideo',
            imageURL: '/attachment/images/new_file.png',
            imageTitle: 'add a new video'
        },
        openDialog: function() {
            this.dialog.showVideoDialog();
        }
    };
    
    return VideoController;
});