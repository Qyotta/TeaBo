define([
        'underscore',
        '/core/js/utils/subscribe_command.js',
        '/whiteboardItem/js/collection/WhiteboardItemCollection.js'], function(_,SubscribeCommand,WhiteboardItemCollection){
    
    var WhiteboardItemController = function(options){
        _.bindAll(this,'whiteboardOpened','whiteboardClosed','movedItem');
        window.app.eventDispatcher.bind("whiteboard:opened",this.whiteboardOpened);
        window.app.eventDispatcher.bind('whiteboard:closed',this.whiteboardClosed);
        this.initialize();
    };
    
    WhiteboardItemController.prototype = {
        initialize : function(){
            
        },
        subscribeChannels : function(){
            var commands = [];
            commands.push(new SubscribeCommand('/whiteboardItem/move/'          +this.whiteboard.id,this.movedItem));
            commands.push(new SubscribeCommand('/whiteboardItem/delete/'        +this.whiteboard.id,this.deletedItem));
            window.app.groupCommand.addCommands(commands);
        },
        whiteboardOpened : function(whiteboard){
            this.whiteboard = whiteboard;
            this.collection = new WhiteboardItemCollection(null,{id:whiteboard.id});
            var self = this;
            this.collection.fetch({
                    success : function(collection, response) {
                        collection.each(function(_item) {
                            window.app.eventDispatcher.trigger('whiteboardItem:loaded:'+_item.get('item').class,_item);
                        });
                        self.subscribeChannels();
                   }
            });
        },
        whiteboardClosed : function(){
            this.whiteboard = null;
            this.collection = null;
        },
        movedItem : function(message){
            var id = message.id;
            var x = message.x;
            var y = message.y;
            var item = this.collection.get(id);
            item.set({x:x,y:y});
            console.log("Whiteboard item moved")
        },
        deletedItem : function(message){
            
        }
    };
    
    return WhiteboardItemController;
});