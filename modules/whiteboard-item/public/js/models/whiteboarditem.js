define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    var WhiteboardItem = Backbone.Model.extend({
        idAttribute: "_id"
    });
    
    return WhiteboardItem;
});
