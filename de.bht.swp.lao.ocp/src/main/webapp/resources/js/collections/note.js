define([
    'jquery',
    'underscore',
    'backbone',
    'models/note'
], function($, _, Backbone, Note){

    var NoteCollection = Backbone.Collection.extend({
        initialize: function(models, options) {
			this.id = options.id;
			_.bindAll(this,'subscribeChannels','_handleMovedWhiteboardItem');
			window.app.eventDispatcher.bind('handshakeComplete',this.subscribeChannels);
		},
		model: Note,
		url:function(){
			return this.id?'whiteboard/'+this.id+'/notes':null;
		},
		_handleMovedWhiteboardItem:function(message) {
			var _id = message.data.id;
			var _x = message.data.x;
			var _y = message.data.y;
			var note = this.get(_id);
			note.set({x:_x,y:_y});
		},
		subscribeChannels:function(){
			window.app.subscribeChannel('/whiteboardItem/move/'+this.id,this._handleMovedWhiteboardItem);
		}
    });
    
    return NoteCollection;
});
