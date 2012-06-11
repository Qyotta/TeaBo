define([
    'underscore',
    'backbone',
    '/whiteboardItem/js/models/WhiteboardItem.js',
    '/user/js/model/user.js'
], function(_, Backbone,WhiteboardItem) {
    var Note = WhiteboardItem.extend({
        defaults:{
            text:''
        }
    });
    
    return Note;
});
