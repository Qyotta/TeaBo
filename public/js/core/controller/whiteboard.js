define([
    'jquery',
    'underscore',
    'backbone',
    'core/collections/whiteboard',
    'core/views/whiteboard',
    'core/views/dialogs/confirm_multiple_delete',
    'core/utils/subscribe_command'
], function($, _, Backbone, WhiteboardCollection, WhiteboardView, ConfirmDeleteView,SubscribeCommand){
    var WhiteboardController = function(options){
        _.bindAll(this,'open','close','subscribeChannels','userColorUpdated','sync');
        window.app.eventDispatcher.bind("whiteboard:open",this.open);
        window.app.eventDispatcher.bind("whiteboard:close",this.close);
        window.app.eventDispatcher.bind('handshakeComplete',this.subscribeChannels);
        window.app.eventDispatcher.bind("whiteboard:sync",this.sync);
        this.initialize(options);
    };
    
    WhiteboardController.prototype = {
        initialize:function(options){
            window.app.log('whiteboard loaded');
            this.whiteboards = new WhiteboardCollection();
            this.confirmDeleteView = new ConfirmDeleteView();
            this.sync();
        },
        subscribeChannels:function(){
            var commands = [];
            commands.push(new SubscribeCommand('/assignment/change/color/'+ this.whiteboard.id, this.userColorUpdated));
            window.app.groupCommand.addCommands(commands);
        },
        userColorUpdated:function(message){
            console.log('color update');
            var _assignmentId = message.data.id;
            var assignment = this.whiteboard.get('assignments').get(_assignmentId);
            assignment.set({color:[message.data.color_r/255,message.data.color_g/255,message.data.color_b/255]});
            console.log('color updated');
        },
        sync:function(){
            this.whiteboards.fetch({success: function(collection, response){
                window.app.eventDispatcher.trigger("whiteboard:synced",collection);
                window.app.log('whiteboard:synced');
                return true;
            }, error: function() {
                window.app.log('You are not authorized, please login!');
                window.router.navigate("login", {trigger: true});
                return false;
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