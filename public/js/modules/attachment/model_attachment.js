define([
    'underscore',
    'backbone',
    'core/models/whiteboarditem',
], function(_, Backbone,WhiteboardItem) {
    var Attachment = WhiteboardItem.extend({
        isComplete:function(){
        	return this.get('complete');
        }
    });
    
    return Attachment;
});
