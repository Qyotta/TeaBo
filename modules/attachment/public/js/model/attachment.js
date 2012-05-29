define([
    'underscore',
    'backbone',
    '/whiteboard-item/js/models/whiteboarditem.js',
], function(_, Backbone,WhiteboardItem) {
    var Attachment = WhiteboardItem.extend({
        isComplete:function(){
        	return this.get('complete');
        }
    });
    
    return Attachment;
});
