define([
        'underscore',
        '/core/js/utils/subscribe_command.js',
        '/core/js/utils/model_command.js',
        '/whiteboardItem/js/collection/WhiteboardItemCollection.js',
        '/whiteboardItem/js/models/WhiteboardItem.js',
        '/whiteboard/js/utils/modus.js'
], function(_,SubscribeCommand,ModelCommand,WhiteboardItemCollection,WhiteboardItem,WhiteboardModus){
    
    var WhiteboardItemController = function(options){
        _.bindAll(this,'whiteboardOpened','whiteboardClosed','movedItem','deletedItem','deleteItem','postedItem','startedEditing','stoppedEditing','stopEditing','changeOrder','changedOrder');
        window.app.eventDispatcher.bind("whiteboard:opened",this.whiteboardOpened);
        window.app.eventDispatcher.bind('whiteboard:closed',this.whiteboardClosed);
        window.app.eventDispatcher.bind('whiteboardItem:delete',this.deleteItem);
        
        window.app.eventDispatcher.bind('whiteboardItem:startedEditing',this.startedEditing);
        window.app.eventDispatcher.bind('whiteboardItem:stoppedEditing',this.stoppedEditing);
        window.app.eventDispatcher.bind('whiteboard:mouseup',this.stopEditing);
        window.app.eventDispatcher.bind('whiteboardItem:order_change', this.changeOrder);
        
        this.initialize();
    };
    
    WhiteboardItemController.prototype = {
        initialize : function(){
            
        },
        subscribeChannels:function(){
            this.subscriptions = [];
            this.subscriptions.push(window.app.io.subscribe('/whiteboardItem/posted/'        +this.whiteboard.id,this.postedItem));
            this.subscriptions.push(window.app.io.subscribe('/whiteboardItem/move/'          +this.whiteboard.id,this.movedItem));
            this.subscriptions.push(window.app.io.subscribe('/whiteboardItem/delete/'        +this.whiteboard.id,this.deletedItem));
            this.subscriptions.push(window.app.io.subscribe('/whiteboardItem/changeOrder/'   +this.whiteboard.id,this.changedOrder));
        },
        unsubscribeChannels:function(){
            _.each(this.subscriptions,function(subscription){
                subscription.cancel();
            })
        },
        whiteboardOpened : function(whiteboard){
            this.whiteboard = whiteboard;
            this.collection = new WhiteboardItemCollection(null,{id:whiteboard.id});
            var self = this;
            this.collection.fetch({
                    success : function(collection, response) {
                        collection.each(function(_item) {
                            window.app.eventDispatcher.trigger('whiteboardItem:loaded:'+_item.get('type'),_item);
                        });
                        self.subscribeChannels();
                   }
            });
        },
        whiteboardClosed : function(){
            this.whiteboard = null;
            this.collection = null;
            this.unsubscribeChannels();
        },
        movedItem : function(message){
            var id = message.id;
            var x = message.x;
            var y = message.y;
            var item = this.collection.get(id);
            item.set({x:x,y:y});
            console.log("Whiteboard item moved");
        },
        deletedItem : function(message){
            var _id = message.id;
            var _item = this.collection.get(_id);
            if(_item) {
                window.app.eventDispatcher.trigger("whiteboardItem:deleted:"+_item.get('type'),_item);
                this.collection.remove(_item);
            }
        },
        deleteItem : function(model) {
            if (typeof model === 'undefined' || model === null) {
                window.app.log('delete-event triggered multiple times');
            } else {
                window.app.groupCommand.addCommands(new ModelCommand(
                    '/service/whiteboardItem/delete',
                    { id : model.id, whiteboardid : this.whiteboard.id }
                ));
            }
        },
        postedItem:function(message){
            var item = new WhiteboardItem(message);
            this.collection.add(item);
            window.app.eventDispatcher.trigger('whiteboardItem:loaded:'+item.get('type'),item);
        },
        startedEditing:function(view){
            if(this.editing)this.editing.stopEditing();
            this.editing = view;
        },
        stopEditing:function(){
            if(this.editing)this.editing.stopEditing();
        },
        stoppedEditing:function(){
            this.editing = null;
        },
        changeOrder:function(model){
            window.app.groupCommand.addCommands(new ModelCommand(
                    '/service/whiteboardItem/order',
                    { id : model.id, whiteboardid : this.whiteboard.id }
                ));
        },
        changedOrder:function(message){
            var id = message.id;
            var order = message.order;
            var item = this.collection.get(id);
            item.set({orderIndex:order});
        }
    };
    
    return WhiteboardItemController;
});