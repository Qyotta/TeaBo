define([
    'jquery',
    'underscore',
    'backbone',
    '/whiteboard/js/collection/whiteboard.js',
    '/whiteboard/js/views/whiteboard.js',
    '/whiteboardItem/js/views/confirm_multiple_delete.js',
    '/core/js/utils/subscribe_command.js'
], function($, _, Backbone, WhiteboardCollection, WhiteboardView, ConfirmDeleteView,SubscribeCommand){
    var WhiteboardController = function(){
        _.bindAll(this,'open','close','subscribeChannels','sync','overview');
        window.app.eventDispatcher.bind("whiteboard:open",this.open);
        window.app.eventDispatcher.bind("whiteboard:close",this.close);
        window.app.eventDispatcher.bind('handshakeComplete',this.subscribeChannels);
        window.app.eventDispatcher.bind("whiteboard:sync",this.sync);
        this.initialize();
    };
    
    WhiteboardController.prototype = {
        initialize:function(){
            this.whiteboards = new WhiteboardCollection();
            this.confirmDeleteView = new ConfirmDeleteView();
            if(window.app.loggedIn()) {
                this.sync();
            }
        },
        subscribeChannels:function(){
            var commands = [];
            window.app.groupCommand.addCommands(commands);
        },
        overview : function(){
            console.log("whiteboard overview");
            this.sync();
        },
        sync:function(){
            this.whiteboards.fetch({success: function(collection, response){
                window.app.log('whiteboard:synced');
                window.app.eventDispatcher.trigger("whiteboard:synced",collection);
                return true;
            }, error: function() {
                console.error('[ERROR] - couldn\'t sync whiteboard');
            }});
        },
        open:function(id){
            this.whiteboard = this.whiteboards.get(id);
            var self = this;
            if(!this.whiteboard){
                this.whiteboards.fetch(
                        {
                            success: function(collection, response){
                                window.app.eventDispatcher.trigger("whiteboard:synced",collection);
                                window.app.log('whiteboard:synced');
                                self.open(id);
                            }, 
                            error: function() {
                                window.app.log('You are not authorized, please login!');
                                window.router.navigate("login", {trigger: true});
                                return false;
                            }
                        }
                );
                return;
            }
            this.view = new WhiteboardView({model:this.whiteboard});
            window.app.eventDispatcher.trigger('whiteboard:opened',this.whiteboard);
        },
        close:function(){
            this.view.remove();
            this.view = null;
            this.whiteboard = null;
            window.app.eventDispatcher.trigger('whiteboard:closed');
        }
    };
    
    return WhiteboardController;
});