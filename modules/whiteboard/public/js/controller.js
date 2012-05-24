define([
    'jquery',
    'underscore',
    'backbone',
    '/whiteboard/js/collections/whiteboard.js',
    '/whiteboard/js/views/whiteboard.js',
    '/core/js/views/dialogs/confirm_multiple_delete.js',
    '/core/js/utils/subscribe_command.js'
], function($, _, Backbone, WhiteboardCollection, WhiteboardView, ConfirmDeleteView,SubscribeCommand){
    var WhiteboardController = function(){
        window.app.log('whiteboard load');
        _.bindAll(this,'open','close','subscribeChannels','userColorUpdated','sync','overview');
        window.app.eventDispatcher.trigger("whiteboard:overview",this.overview);
        
        window.app.eventDispatcher.bind("whiteboard:open",this.open);
        window.app.eventDispatcher.bind("whiteboard:close",this.close);
        window.app.eventDispatcher.bind('handshakeComplete',this.subscribeChannels);
        window.app.eventDispatcher.bind("whiteboard:sync",this.sync);
        this.initialize();
    };
    
    WhiteboardController.prototype = {
        initialize:function(){
            window.app.log('whiteboard loaded');
            this.whiteboards = new WhiteboardCollection();
            this.confirmDeleteView = new ConfirmDeleteView();
            // this.sync();
        },
        subscribeChannels:function(){
            var commands = [];
            commands.push(new SubscribeCommand('/assignment/change/color/'+ this.whiteboard.id, this.userColorUpdated));
            window.app.groupCommand.addCommands(commands);
        },
        overview : function(){
            console.log("whiteboard overview");
            this.sync();
        },
        userColorUpdated:function(message){
            var _assignmentId = message.data.id;
            var assignment = this.whiteboard.get('assignments').get(_assignmentId);
            assignment.set({color:[message.data.color_r/255,message.data.color_g/255,message.data.color_b/255]});
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
            window.app.startCometd();
            window.app.eventDispatcher.trigger('whiteboard:opened',this.whiteboard);
        },
        close:function(){
            if(this.whiteboard) {
                $(this.view.el).empty();
            }
            this.whiteboard = null;
            window.app.stopCometd();
            window.app.eventDispatcher.trigger('whiteboard:closed');
        }
    };
    
    return WhiteboardController;
});