define([
    'underscore',
    'backbone',
    '/whiteboardItem/js/models/whiteboarditem.js',
    '/user/js/model/user.js'
], function(_, Backbone,WhiteboardItem) {
    var Note = WhiteboardItem.extend({});
    
    return Note;
});
