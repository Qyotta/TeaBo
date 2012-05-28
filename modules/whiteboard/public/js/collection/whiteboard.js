define([
    'jquery',
    'underscore',
    'backbone',
    '/whiteboard/js/model/whiteboard.js'
], function($, _, Backbone, Whiteboard){

    var WhiteboardCollection = Backbone.Collection.extend({
        model: Whiteboard,
        idAttribute: "_id",
        url: 'whiteboard/'
    });
    
    return WhiteboardCollection;
});
