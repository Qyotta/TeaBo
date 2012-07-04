define([
    'underscore',
    '/video/js/views/video.js',
    '/video/js/views/dialog.js',
    '/video/js/views/confirm_delete.js'
], function(_, VideoView, Dialog, ConfirmDeleteView){
    
    var VideoController = function(options){
        _.bindAll(this,'openDialog','loadedVideo','whiteboardOpened','deletedVideo');
        window.app.eventDispatcher.bind("toolbar:addVideo", this.openDialog);
        window.app.eventDispatcher.bind("whiteboard:opened",this.whiteboardOpened);
        window.app.eventDispatcher.bind("whiteboard:closed",this.whiteboardClosed);
        window.app.eventDispatcher.bind("whiteboardItem:loaded:video", this.loadedVideo);
        window.app.eventDispatcher.bind("whiteboardItem:deleted:video", this.deletedVideo);

        this.initialize();
    };
    
    VideoController.prototype = {
        initialize: function() {
            this.dialog = new Dialog({controller:this});
            this.confirmDeleteView = new ConfirmDeleteView();
            this.views  = [];
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
        },
        loadedVideo: function(video) {

            var view = new VideoView({
                model : video,
                controller: this
            });

            view.render();
            this.views.push(view);
        },
        whiteboardOpened: function() {
            _.each(this.views,function(view){
                view.render();
            });
        },
        whiteboardClosed:function(){
            this.views = [];
        },
        findViewById:function(id){
            var result=null;
            _.each(this.views,function(view){
                if(id === view.model.id){
                    result = view;
                    return;
                }
            });
            return result;
        },
        deletedVideo : function(video){
            var view = this.findViewById(video.id);
            if(view) view.remove();
        }
    };
    
    return VideoController;
});