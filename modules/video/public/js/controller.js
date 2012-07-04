define([
    'underscore'
], function(_){
    
    var VideoController = function(options){
        // _.bindAll(this,);

        this.initialize();
    };
    
    VideoController.prototype = {
        initialize: function() {

        },
        index: 5,
        toolbarTool: {
            name: 'Video',
            action: 'addVideo',
            imageURL: '/attachment/images/new_file.png',
            imageTitle: 'add a new video'
        }
    };
    
    return VideoController;
});