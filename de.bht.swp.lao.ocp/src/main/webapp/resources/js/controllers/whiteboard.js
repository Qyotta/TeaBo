define([
    'jquery',
    'underscore',
    'backbone',
    'collections/whiteboard',
	'views/whiteboard/whiteboard'
], function($, _, Backbone, WhiteboardCollection, WhiteboardView){
    
    var WhiteboardController = function(options){
    	
    	_.bindAll(this,'open','close');
    	window.app.eventDispatcher.bind("whiteboard:open",this.open);
    	window.app.eventDispatcher.bind("whiteboard:close",this.close);
    	
    	this.initialize(options);
    };
    
    WhiteboardController.prototype = {
    	initialize:function(options){
    		this.whiteboards = new WhiteboardCollection();
    		this.sync();
    	},
    	sync:function(){
    		this.whiteboards.fetch({success: function(collection, response){
        		window.app.eventDispatcher.trigger("whiteboard:synced",collection);
        		window.app.log('whiteboard:synced');
            }});
    	},
    	open:function(id){
    		this.whiteboard = this.whiteboards.get(id);
			this.view = new WhiteboardView();
			window.app.startCometd();
			window.app.eventDispatcher.trigger("whiteboard:opened",this.whiteboard);
    	},
    	close:function(){
    		this.whiteboard = null;
			this.view.remove();
			window.app.stopCometd();
			window.app.eventDispatcher.trigger("whiteboard:closed",whiteboard);
    	}
    };
    
    return WhiteboardController;
});