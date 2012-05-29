define([
    'underscore',
    'backbone',
    '/whiteboard-item/js/models/whiteboarditem.js',
], function(_, Backbone,WhiteboardItem) {
    var Note = WhiteboardItem.extend({
        creator:function(){
            return this.get("creator");
        }
    });
    
    return Note;
});
