define([
    'underscore',
    'backbone',
    'core/models/whiteboarditem',
], function(_, Backbone,WhiteboardItem) {
    var Note = WhiteboardItem.extend({
        creator:function(){
            return this.get("creator");
        }
    });
    
    return Note;
});
