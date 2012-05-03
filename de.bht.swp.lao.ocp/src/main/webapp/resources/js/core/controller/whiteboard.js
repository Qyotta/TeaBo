define([
    'jquery',
    'underscore',
    'backbone',
    'core/collections/whiteboard',
    'core/views/whiteboard',
], function($, _, Backbone, WhiteboardCollection, WhiteboardView){
    var WhiteboardController = function(options){
        
        _.bindAll(this,'open','close');
        window.app.eventDispatcher.bind("whiteboard:open",this.open);
        window.app.eventDispatcher.bind("whiteboard:close",this.close);
        
        this.initialize(options);
    };
    
    WhiteboardController.prototype = {
        initialize:function(options){
            window.app.log('whiteboard loaded');
            this.whiteboards = new WhiteboardCollection();
            this.sync();
        },
        sync:function(){
            this.whiteboards.fetch({success: function(collection, response){
                window.app.eventDispatcher.trigger("whiteboard:synced",collection);
                window.app.log('whiteboard:synced');
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
            console.log(this.whiteboard);
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